import secrets
from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.database import get_db
from app.core.deps import get_current_user, get_provider

from app.schemas.bill import BillCreate, BillResponse, BillUpdate

router = APIRouter(prefix="/bills", tags=["Bills"])


def _bill_to_response(bill: dict) -> BillResponse:
    return BillResponse(
        id=str(bill["_id"]),
        patient_id=str(bill["patient_id"]),
        provider_id=str(bill["provider_id"]),
        amount=bill["amount"],
        amount_due=bill.get("amount_due", bill["amount"]),
        service_description=bill["service_description"],
        service_date=bill["service_date"],
        insurance_adjustment=bill.get("insurance_adjustment", 0),
        status=bill["status"],
        due_date=bill["due_date"],
        provider_name=bill["provider_name"],
        payment_link=bill.get("payment_link"),
        created_at=bill["created_at"].isoformat(),
    )


@router.post("", response_model=BillResponse, status_code=201)
async def create_bill(body: BillCreate, user=Depends(get_provider)):
    db = get_db()

    # Generate unique payment link code
    pay_code = secrets.token_urlsafe(8)

    bill_doc = {
        "patient_id": ObjectId(body.patient_id),
        "provider_id": user["_id"],
        "amount": body.amount,
        "amount_due": body.amount - body.insurance_adjustment,
        "service_description": body.service_description,
        "service_date": body.service_date,
        "insurance_adjustment": body.insurance_adjustment,
        "status": "pending",
        "due_date": body.due_date,
        "provider_name": body.provider_name,
        "payment_link": f"/pay/{pay_code}",
        "pay_code": pay_code,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    result = await db.bills.insert_one(bill_doc)
    bill_doc["_id"] = result.inserted_id

    # Audit log
    await db.audit_logs.insert_one(
        {
            "action": "bill_created",
            "user_id": str(user["_id"]),
            "details": {
                "bill_id": str(result.inserted_id),
                "patient_id": body.patient_id,
                "amount": body.amount,
            },
            "timestamp": datetime.now(timezone.utc),
        }
    )

    return _bill_to_response(bill_doc)


@router.get("", response_model=list[BillResponse])
async def list_bills(
    status_filter: str | None = Query(None, alias="status"),
    limit: int = Query(50, le=100),
    skip: int = Query(0, ge=0),
    user=Depends(get_current_user),
):
    db = get_db()
    query: dict = {}

    if user["role"] == "patient":
        query["patient_id"] = user["_id"]
    elif user["role"] == "provider":
        query["provider_id"] = user["_id"]
    # admin sees all

    if status_filter:
        query["status"] = status_filter

    cursor = db.bills.find(query).sort("created_at", -1).skip(skip).limit(limit)
    bills = await cursor.to_list(length=limit)
    return [_bill_to_response(b) for b in bills]


@router.get("/{bill_id}", response_model=BillResponse)
async def get_bill(bill_id: str, user=Depends(get_current_user)):
    db = get_db()
    bill = await db.bills.find_one({"_id": ObjectId(bill_id)})

    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    # Verify access
    if user["role"] == "patient" and bill["patient_id"] != user["_id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    if user["role"] == "provider" and bill["provider_id"] != user["_id"]:
        raise HTTPException(status_code=403, detail="Access denied")

    return _bill_to_response(bill)


@router.patch("/{bill_id}", response_model=BillResponse)
async def update_bill(bill_id: str, body: BillUpdate, user=Depends(get_provider)):
    db = get_db()

    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)

    result = await db.bills.find_one_and_update(
        {"_id": ObjectId(bill_id)},
        {"$set": update_data},
        return_document=True,
    )

    if not result:
        raise HTTPException(status_code=404, detail="Bill not found")

    return _bill_to_response(result)


@router.get("/pay/{pay_code}", response_model=BillResponse)
async def get_bill_by_pay_code(pay_code: str):
    """Public endpoint — patients access bills via payment link (no auth needed)."""
    db = get_db()
    bill = await db.bills.find_one({"pay_code": pay_code})

    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    # Mark as viewed
    if bill["status"] == "sent":
        await db.bills.update_one(
            {"_id": bill["_id"]},
            {"$set": {"status": "viewed", "viewed_at": datetime.now(timezone.utc)}},
        )
        bill["status"] = "viewed"

    return _bill_to_response(bill)
