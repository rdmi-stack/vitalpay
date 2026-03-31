"""Outbound webhooks for EMR integration — notifies external systems when payments are made."""

import os
from datetime import datetime, timezone

import httpx
from bson import ObjectId
from fastapi import APIRouter, Depends, Query

from app.core.database import get_db
from app.core.deps import get_provider

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


async def send_payment_webhook(payment_doc: dict, bill_doc: dict, patient_doc: dict):
    """Send payment notification to configured EMR webhook URL."""
    db = get_db()

    # Get provider's webhook URL
    provider = await db.users.find_one({"_id": bill_doc["provider_id"]})
    webhook_url = None
    if provider:
        webhook_url = provider.get("webhook_url") or os.getenv("EMR_WEBHOOK_URL")

    if not webhook_url:
        print(f"[DEV WEBHOOK] Payment {payment_doc['_id']} — no webhook configured")
        return

    payload = {
        "event": "payment.completed",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "payment": {
            "id": str(payment_doc["_id"]),
            "amount": payment_doc["amount"],
            "method": payment_doc["method"],
            "status": payment_doc["status"],
            "stripe_payment_id": payment_doc.get("stripe_payment_id"),
        },
        "bill": {
            "id": str(bill_doc["_id"]),
            "service_description": bill_doc["service_description"],
            "original_amount": bill_doc["amount"],
            "amount_due": bill_doc.get("amount_due", 0),
            "status": bill_doc["status"],
        },
        "patient": {
            "id": str(patient_doc["_id"]),
            "first_name": patient_doc["first_name"],
            "last_name": patient_doc["last_name"],
            "date_of_birth": patient_doc["date_of_birth"],
        },
        "provider_name": bill_doc["provider_name"],
    }

    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(webhook_url, json=payload, timeout=10.0)

        # Log webhook delivery
        await db.webhook_logs.insert_one({
            "event": "payment.completed",
            "url": webhook_url,
            "payload": payload,
            "response_status": res.status_code,
            "success": 200 <= res.status_code < 300,
            "created_at": datetime.now(timezone.utc),
        })

        print(f"[WEBHOOK] Payment {payment_doc['_id']} → {webhook_url} = {res.status_code}")
    except Exception as e:
        await db.webhook_logs.insert_one({
            "event": "payment.completed",
            "url": webhook_url,
            "payload": payload,
            "response_status": 0,
            "success": False,
            "error": str(e),
            "created_at": datetime.now(timezone.utc),
        })
        print(f"[WEBHOOK ERROR] {e}")


# --- Provider webhook configuration ---

@router.get("/config")
async def get_webhook_config(user=Depends(get_provider)):
    return {
        "webhook_url": user.get("webhook_url", ""),
        "events": ["payment.completed", "bill.created", "plan.created"],
    }


@router.post("/config")
async def set_webhook_config(webhook_url: str, user=Depends(get_provider)):
    db = get_db()
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"webhook_url": webhook_url, "updated_at": datetime.now(timezone.utc)}},
    )
    return {"status": "configured", "webhook_url": webhook_url}


@router.get("/logs")
async def get_webhook_logs(
    limit: int = Query(50, le=100),
    user=Depends(get_provider),
):
    db = get_db()
    logs = await db.webhook_logs.find().sort("created_at", -1).limit(limit).to_list(length=limit)
    return [
        {
            "id": str(l["_id"]),
            "event": l["event"],
            "url": l["url"],
            "status": l["response_status"],
            "success": l["success"],
            "created_at": l["created_at"].isoformat(),
        }
        for l in logs
    ]
