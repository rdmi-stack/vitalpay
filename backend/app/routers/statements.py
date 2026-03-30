from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.core.database import get_db
from app.core.deps import get_provider
from app.services.sms import send_payment_sms, send_reminder_sms
from app.services.email import send_payment_email, send_reminder_email

router = APIRouter(prefix="/statements", tags=["Statements"])


class SendStatementRequest(BaseModel):
    bill_id: str
    channels: list[str] = ["sms", "email"]  # sms | email | both


class SendReminderRequest(BaseModel):
    bill_id: str
    channels: list[str] = ["sms", "email"]


@router.post("/send", status_code=201)
async def send_statement(body: SendStatementRequest, user=Depends(get_provider)):
    db = get_db()

    bill = await db.bills.find_one({"_id": ObjectId(body.bill_id)})
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    patient = await db.patients.find_one({"_id": bill["patient_id"]})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    results = {}

    if "sms" in body.channels and patient.get("phone"):
        sms_result = await send_payment_sms(
            to_phone=patient["phone"],
            patient_name=patient["first_name"],
            provider_name=bill["provider_name"],
            amount=bill.get("amount_due", bill["amount"]),
            pay_code=bill["pay_code"],
        )
        results["sms"] = sms_result

    if "email" in body.channels and patient.get("email"):
        email_result = await send_payment_email(
            to_email=patient["email"],
            patient_name=patient["first_name"],
            provider_name=bill["provider_name"],
            amount=bill.get("amount_due", bill["amount"]),
            service_description=bill["service_description"],
            pay_code=bill["pay_code"],
        )
        results["email"] = email_result

    # Log statement
    statement_doc = {
        "bill_id": bill["_id"],
        "patient_id": patient["_id"],
        "provider_id": user["_id"],
        "channels": body.channels,
        "results": results,
        "type": "initial",
        "sent_at": datetime.now(timezone.utc),
        "opened": False,
        "clicked": False,
        "paid": False,
    }
    await db.statements.insert_one(statement_doc)

    # Update bill status
    await db.bills.update_one(
        {"_id": bill["_id"]},
        {"$set": {"status": "sent", "updated_at": datetime.now(timezone.utc)}},
    )

    # Audit log
    await db.audit_logs.insert_one({
        "action": "statement_sent",
        "user_id": str(user["_id"]),
        "details": {"bill_id": body.bill_id, "channels": body.channels},
        "timestamp": datetime.now(timezone.utc),
    })

    return {"status": "sent", "channels": body.channels, "results": results}


@router.post("/remind", status_code=201)
async def send_reminder(body: SendReminderRequest, user=Depends(get_provider)):
    db = get_db()

    bill = await db.bills.find_one({"_id": ObjectId(body.bill_id)})
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    patient = await db.patients.find_one({"_id": bill["patient_id"]})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Calculate days overdue
    due_date = datetime.strptime(bill["due_date"], "%Y-%m-%d").replace(tzinfo=timezone.utc)
    days_overdue = max((datetime.now(timezone.utc) - due_date).days, 0)

    results = {}

    if "sms" in body.channels and patient.get("phone"):
        results["sms"] = await send_reminder_sms(
            to_phone=patient["phone"],
            patient_name=patient["first_name"],
            provider_name=bill["provider_name"],
            amount=bill.get("amount_due", bill["amount"]),
            pay_code=bill["pay_code"],
            days_overdue=days_overdue,
        )

    if "email" in body.channels and patient.get("email"):
        results["email"] = await send_reminder_email(
            to_email=patient["email"],
            patient_name=patient["first_name"],
            provider_name=bill["provider_name"],
            amount=bill.get("amount_due", bill["amount"]),
            pay_code=bill["pay_code"],
            days_overdue=days_overdue,
        )

    # Log reminder
    await db.statements.insert_one({
        "bill_id": bill["_id"],
        "patient_id": patient["_id"],
        "provider_id": user["_id"],
        "channels": body.channels,
        "results": results,
        "type": "reminder",
        "days_overdue": days_overdue,
        "sent_at": datetime.now(timezone.utc),
    })

    return {"status": "reminder_sent", "days_overdue": days_overdue, "results": results}


@router.get("")
async def list_statements(
    limit: int = Query(50, le=100),
    skip: int = Query(0, ge=0),
    user=Depends(get_provider),
):
    db = get_db()
    query = {"provider_id": user["_id"]} if user["role"] == "provider" else {}

    cursor = db.statements.find(query).sort("sent_at", -1).skip(skip).limit(limit)
    statements = await cursor.to_list(length=limit)

    return [
        {
            "id": str(s["_id"]),
            "bill_id": str(s["bill_id"]),
            "patient_id": str(s["patient_id"]),
            "channels": s["channels"],
            "type": s.get("type", "initial"),
            "sent_at": s["sent_at"].isoformat(),
            "opened": s.get("opened", False),
            "clicked": s.get("clicked", False),
            "paid": s.get("paid", False),
        }
        for s in statements
    ]
