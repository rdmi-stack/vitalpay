from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.core.database import get_db
from app.core.deps import get_current_user, get_provider
from app.services.voice import get_ai_response, generate_speech, make_outbound_call
from app.services.sms import send_payment_sms

router = APIRouter(prefix="/voice", tags=["Voice Agent"])


# --- Public chat endpoint (for website voice widget) ---

class ChatMessage(BaseModel):
    message: str
    history: list[dict] = []


DEMO_PATIENT = {
    "name": "Sarah",
    "amount_due": 245.00,
    "provider_name": "Valley Health",
    "service_description": "Office visit, March 5 2026",
}

FALLBACK_RESPONSES = {
    "hello": "Hi! I'm the PayVital AI billing assistant. I can help you understand your medical bills, make payments, or set up a payment plan. How can I help you today?",
    "bill": "You have a balance of $245.00 from Valley Health for an office visit on March 5th. Your insurance covered $235, leaving $245 as your responsibility. Would you like to pay now or set up a plan?",
    "pay": "I can help with that! I'll send you a secure payment link via text right now. You can pay the full $245 or split it into monthly payments. Which do you prefer?",
    "plan": "Absolutely! I can set up a payment plan for you. Here are your options: 3 months at $81.67/month, 6 months at $40.83/month, or 12 months at $20.42/month. Which works best?",
    "how": "PayVital is an AI-powered healthcare billing platform. We help medical practices collect payments faster through text-to-pay, AI voice calls, and smart payment plans. Practices using PayVital see an 85% collection rate — up from the industry average of 55%.",
    "cost": "PayVital pricing starts at $500/month for small practices, with transaction fees of 2.5-3.5%. Most practices see ROI within the first month — typically collecting an extra $30,000-$50,000 per month in previously lost revenue.",
    "default": "I can help you with bill questions, payments, payment plans, or connect you with our team. What would you like to know?",
}


def get_fallback_response(message: str) -> str:
    msg = message.lower()
    if any(w in msg for w in ["hi", "hello", "hey", "start"]):
        return FALLBACK_RESPONSES["hello"]
    if any(w in msg for w in ["bill", "owe", "balance", "charge", "amount"]):
        return FALLBACK_RESPONSES["bill"]
    if any(w in msg for w in ["pay", "card", "link", "send"]):
        return FALLBACK_RESPONSES["pay"]
    if any(w in msg for w in ["plan", "monthly", "installment", "split"]):
        return FALLBACK_RESPONSES["plan"]
    if any(w in msg for w in ["how", "what", "payvital", "work", "about"]):
        return FALLBACK_RESPONSES["how"]
    if any(w in msg for w in ["cost", "price", "pricing", "much"]):
        return FALLBACK_RESPONSES["cost"]
    return FALLBACK_RESPONSES["default"]


@router.post("/chat")
async def voice_chat(body: ChatMessage):
    """Public chat endpoint for the website voice widget. Uses OpenAI if available, otherwise smart fallback."""
    import os
    openai_key = os.getenv("OPENAI_API_KEY", "")

    if openai_key:
        response = await get_ai_response(DEMO_PATIENT, body.history, body.message)
    else:
        response = get_fallback_response(body.message)

    return {"response": response}


from fastapi import UploadFile, File
from fastapi.responses import Response


@router.post("/stt")
async def speech_to_text(file: UploadFile = File(...)):
    """Transcribe audio using ElevenLabs STT. Falls back to returning empty if no key."""
    from app.services.voice import transcribe_audio, ELEVENLABS_API_KEY

    audio_data = await file.read()

    if not ELEVENLABS_API_KEY:
        return {"text": "", "error": "ELEVENLABS_API_KEY not set. Add it to backend/.env"}

    text = await transcribe_audio(audio_data)
    return {"text": text}


@router.post("/tts")
async def text_to_speech(body: ChatMessage):
    """Convert text to speech using ElevenLabs TTS. Returns audio bytes."""
    from app.services.voice import generate_speech, ELEVENLABS_API_KEY

    if not ELEVENLABS_API_KEY:
        return Response(content=b"", media_type="audio/mpeg", headers={"X-Error": "No ElevenLabs key"})

    audio = await generate_speech(body.message)
    if audio:
        return Response(content=audio, media_type="audio/mpeg")
    return Response(content=b"", media_type="audio/mpeg", headers={"X-Error": "TTS failed"})


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
