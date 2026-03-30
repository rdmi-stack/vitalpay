from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.core.database import get_db
from app.core.deps import get_current_user, get_provider
from app.services.voice import get_ai_response, make_outbound_call
from app.services.sms import send_payment_sms

router = APIRouter(prefix="/voice", tags=["Voice Agent"])


class OutboundCallRequest(BaseModel):
    patient_id: str
    bill_id: str


class CampaignCreate(BaseModel):
    name: str
    type: str = "reminder"  # reminder | previsit | followup
    days_overdue_min: int = 3
    days_overdue_max: int = 90
    status: str = "active"


class InboundWebhook(BaseModel):
    call_id: str
    patient_phone: str
    transcript: str = ""
    duration: int = 0
    outcome: str = "in_progress"  # paid | plan_setup | escalated | no_answer | completed


# --- Inbound webhook ---

@router.post("/inbound")
async def handle_inbound_call(body: InboundWebhook):
    """Webhook endpoint for inbound voice AI calls (from Twilio/ElevenLabs)."""
    db = get_db()

    # Find patient by phone
    patient = await db.patients.find_one({"phone": body.patient_phone})

    call_doc = {
        "call_id": body.call_id,
        "patient_id": patient["_id"] if patient else None,
        "patient_phone": body.patient_phone,
        "direction": "inbound",
        "duration": body.duration,
        "transcript": body.transcript,
        "outcome": body.outcome,
        "created_at": datetime.now(timezone.utc),
    }

    await db.voice_calls.insert_one(call_doc)

    # If patient found, get their bill context for AI
    bill_context = {}
    if patient:
        bill = await db.bills.find_one(
            {"patient_id": patient["_id"], "status": {"$ne": "paid"}},
            sort=[("created_at", -1)],
        )
        if bill:
            bill_context = {
                "name": f"{patient['first_name']} {patient['last_name']}",
                "amount_due": bill.get("amount_due", bill["amount"]),
                "provider_name": bill["provider_name"],
                "service_description": bill["service_description"],
            }

    # Get AI response
    ai_response = await get_ai_response(bill_context, [], body.transcript)

    return {"response": ai_response, "patient_found": patient is not None}


# --- Outbound calls ---

@router.post("/outbound", status_code=201)
async def trigger_outbound_call(body: OutboundCallRequest, user=Depends(get_provider)):
    db = get_db()

    patient = await db.patients.find_one({"_id": ObjectId(body.patient_id)})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    bill = await db.bills.find_one({"_id": ObjectId(body.bill_id)})
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    # For now, send SMS with payment link instead of actual voice call
    # (Voice call requires Twilio voice number + TwiML app setup)
    sms_result = await send_payment_sms(
        to_phone=patient["phone"],
        patient_name=patient["first_name"],
        provider_name=bill["provider_name"],
        amount=bill.get("amount_due", bill["amount"]),
        pay_code=bill["pay_code"],
    )

    # Log the outbound attempt
    call_doc = {
        "patient_id": patient["_id"],
        "bill_id": bill["_id"],
        "patient_phone": patient["phone"],
        "direction": "outbound",
        "duration": 0,
        "transcript": "",
        "outcome": "sms_sent",
        "triggered_by": str(user["_id"]),
        "created_at": datetime.now(timezone.utc),
    }
    await db.voice_calls.insert_one(call_doc)

    return {"status": "outbound_initiated", "sms": sms_result}


# --- Call history ---

@router.get("/calls")
async def list_calls(
    direction: str | None = None,
    limit: int = Query(50, le=100),
    skip: int = Query(0, ge=0),
    user=Depends(get_provider),
):
    db = get_db()
    query: dict = {}
    if direction:
        query["direction"] = direction

    cursor = db.voice_calls.find(query).sort("created_at", -1).skip(skip).limit(limit)
    calls = await cursor.to_list(length=limit)

    return [
        {
            "id": str(c["_id"]),
            "call_id": c.get("call_id", ""),
            "patient_id": str(c["patient_id"]) if c.get("patient_id") else None,
            "patient_phone": c.get("patient_phone", ""),
            "direction": c["direction"],
            "duration": c.get("duration", 0),
            "outcome": c.get("outcome", ""),
            "created_at": c["created_at"].isoformat(),
        }
        for c in calls
    ]


@router.get("/calls/{call_id}")
async def get_call(call_id: str, user=Depends(get_provider)):
    db = get_db()
    call = await db.voice_calls.find_one({"_id": ObjectId(call_id)})
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    return {
        "id": str(call["_id"]),
        "call_id": call.get("call_id", ""),
        "patient_id": str(call["patient_id"]) if call.get("patient_id") else None,
        "patient_phone": call.get("patient_phone", ""),
        "direction": call["direction"],
        "duration": call.get("duration", 0),
        "transcript": call.get("transcript", ""),
        "outcome": call.get("outcome", ""),
        "created_at": call["created_at"].isoformat(),
    }


# --- Campaigns ---

@router.post("/campaigns", status_code=201)
async def create_campaign(body: CampaignCreate, user=Depends(get_provider)):
    db = get_db()

    campaign_doc = {
        "name": body.name,
        "type": body.type,
        "filters": {
            "days_overdue_min": body.days_overdue_min,
            "days_overdue_max": body.days_overdue_max,
        },
        "status": body.status,
        "stats": {"total": 0, "completed": 0, "paid": 0},
        "created_by": str(user["_id"]),
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.voice_campaigns.insert_one(campaign_doc)
    campaign_doc["_id"] = result.inserted_id

    return {
        "id": str(campaign_doc["_id"]),
        "name": campaign_doc["name"],
        "type": campaign_doc["type"],
        "status": campaign_doc["status"],
        "created_at": campaign_doc["created_at"].isoformat(),
    }


@router.get("/campaigns")
async def list_campaigns(user=Depends(get_provider)):
    db = get_db()
    cursor = db.voice_campaigns.find().sort("created_at", -1)
    campaigns = await cursor.to_list(length=50)

    return [
        {
            "id": str(c["_id"]),
            "name": c["name"],
            "type": c["type"],
            "status": c["status"],
            "stats": c.get("stats", {}),
            "created_at": c["created_at"].isoformat(),
        }
        for c in campaigns
    ]


@router.patch("/campaigns/{campaign_id}")
async def update_campaign(campaign_id: str, status: str, user=Depends(get_provider)):
    db = get_db()

    if status not in ("active", "paused", "completed"):
        raise HTTPException(status_code=400, detail="Invalid status")

    result = await db.voice_campaigns.find_one_and_update(
        {"_id": ObjectId(campaign_id)},
        {"$set": {"status": status}},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Campaign not found")

    return {"id": str(result["_id"]), "status": result["status"]}


# --- Analytics ---

@router.get("/analytics")
async def voice_analytics(user=Depends(get_provider)):
    db = get_db()

    total_calls = await db.voice_calls.count_documents({})
    inbound = await db.voice_calls.count_documents({"direction": "inbound"})
    outbound = await db.voice_calls.count_documents({"direction": "outbound"})
    paid = await db.voice_calls.count_documents({"outcome": "paid"})
    escalated = await db.voice_calls.count_documents({"outcome": "escalated"})
    active_campaigns = await db.voice_campaigns.count_documents({"status": "active"})

    return {
        "total_calls": total_calls,
        "inbound": inbound,
        "outbound": outbound,
        "paid_via_call": paid,
        "escalated": escalated,
        "conversion_rate": round((paid / total_calls * 100), 1) if total_calls > 0 else 0,
        "active_campaigns": active_campaigns,
    }
