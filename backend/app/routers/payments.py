from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.database import get_db
from app.core.deps import get_current_user

from app.schemas.payment import (
    PaymentCreate,
    PaymentPlanCreate,
    PaymentPlanResponse,
    PaymentResponse,
)

router = APIRouter(prefix="/payments", tags=["Payments"])


def _payment_to_response(p: dict) -> PaymentResponse:
    return PaymentResponse(
        id=str(p["_id"]),
        bill_id=str(p["bill_id"]),
        patient_id=str(p["patient_id"]),
        amount=p["amount"],
        method=p["method"],
        status=p["status"],
        stripe_payment_id=p.get("stripe_payment_id"),
        created_at=p["created_at"].isoformat(),
    )


def _plan_to_response(p: dict) -> PaymentPlanResponse:
    return PaymentPlanResponse(
        id=str(p["_id"]),
        bill_id=str(p["bill_id"]),
        patient_id=str(p["patient_id"]),
        total_amount=p["total_amount"],
        installment_amount=p["installment_amount"],
        installments=p["installments"],
        installments_paid=p.get("installments_paid", 0),
        frequency=p["frequency"],
        status=p["status"],
        next_due_date=p["next_due_date"],
        created_at=p["created_at"].isoformat(),
    )


@router.post("", response_model=PaymentResponse, status_code=201)
async def create_payment(body: PaymentCreate, user=Depends(get_current_user)):
    db = get_db()

    # Verify bill exists
    bill = await db.bills.find_one({"_id": ObjectId(body.bill_id)})
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    # TODO: Process with Stripe here
    # For now, create payment record directly

    payment_doc = {
        "bill_id": ObjectId(body.bill_id),
        "patient_id": user["_id"],
        "amount": body.amount,
        "method": body.method,
        "status": "completed",  # Will be "pending" when Stripe is integrated
        "stripe_payment_id": None,
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.payments.insert_one(payment_doc)
    payment_doc["_id"] = result.inserted_id

    # Update bill status
    new_amount_due = bill.get("amount_due", bill["amount"]) - body.amount
    bill_status = "paid" if new_amount_due <= 0 else bill["status"]

    await db.bills.update_one(
        {"_id": ObjectId(body.bill_id)},
        {
            "$set": {
                "amount_due": max(new_amount_due, 0),
                "status": bill_status,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )

    # Audit log
    await db.audit_logs.insert_one(
        {
            "action": "payment_made",
            "user_id": str(user["_id"]),
            "details": {
                "payment_id": str(result.inserted_id),
                "bill_id": body.bill_id,
                "amount": body.amount,
            },
            "timestamp": datetime.now(timezone.utc),
        }
    )

    return _payment_to_response(payment_doc)


@router.get("", response_model=list[PaymentResponse])
async def list_payments(
    limit: int = Query(50, le=100),
    skip: int = Query(0, ge=0),
    user=Depends(get_current_user),
):
    db = get_db()
    query: dict = {}

    if user["role"] == "patient":
        query["patient_id"] = user["_id"]
    elif user["role"] == "provider":
        # Get all bills for this provider, then get their payments
        provider_bills = await db.bills.find(
            {"provider_id": user["_id"]}, {"_id": 1}
        ).to_list(length=1000)
        bill_ids = [b["_id"] for b in provider_bills]
        query["bill_id"] = {"$in": bill_ids}

    cursor = db.payments.find(query).sort("created_at", -1).skip(skip).limit(limit)
    payments = await cursor.to_list(length=limit)
    return [_payment_to_response(p) for p in payments]


@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(payment_id: str, user=Depends(get_current_user)):
    db = get_db()
    payment = await db.payments.find_one({"_id": ObjectId(payment_id)})

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    return _payment_to_response(payment)


# --- Payment Plans ---


@router.post("/plans", response_model=PaymentPlanResponse, status_code=201)
async def create_payment_plan(body: PaymentPlanCreate, user=Depends(get_current_user)):
    db = get_db()

    bill = await db.bills.find_one({"_id": ObjectId(body.bill_id)})
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    if body.installments not in (3, 6, 12):
        raise HTTPException(status_code=400, detail="Installments must be 3, 6, or 12")

    installment_amount = round(body.total_amount / body.installments, 2)

    # Calculate next due date (30 days from now for monthly)
    from datetime import timedelta

    next_due = datetime.now(timezone.utc) + timedelta(days=30)

    plan_doc = {
        "bill_id": ObjectId(body.bill_id),
        "patient_id": user["_id"],
        "total_amount": body.total_amount,
        "installment_amount": installment_amount,
        "installments": body.installments,
        "installments_paid": 0,
        "frequency": body.frequency,
        "status": "active",
        "next_due_date": next_due.strftime("%Y-%m-%d"),
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.payment_plans.insert_one(plan_doc)
    plan_doc["_id"] = result.inserted_id

    # Update bill status
    await db.bills.update_one(
        {"_id": ObjectId(body.bill_id)},
        {"$set": {"status": "plan_active", "updated_at": datetime.now(timezone.utc)}},
    )

    return _plan_to_response(plan_doc)


@router.get("/plans/{plan_id}", response_model=PaymentPlanResponse)
async def get_payment_plan(plan_id: str, user=Depends(get_current_user)):
    db = get_db()
    plan = await db.payment_plans.find_one({"_id": ObjectId(plan_id)})

    if not plan:
        raise HTTPException(status_code=404, detail="Payment plan not found")

    return _plan_to_response(plan)
