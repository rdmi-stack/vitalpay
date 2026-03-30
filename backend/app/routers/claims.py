from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.core.database import get_db
from app.core.deps import get_provider
from app.services.claimpilot import detect_denial_action, generate_appeal_letter

router = APIRouter(prefix="/claims", tags=["ClaimPilot"])


class ClaimCreate(BaseModel):
    patient_name: str
    payer: str
    claim_number: str = ""
    amount: float
    service_description: str
    service_date: str
    denial_reason: str = ""
    status: str = "filed"  # filed | denied | appealed | recovered | written_off


class DenialAnalyzeRequest(BaseModel):
    claim_id: str


class AppealGenerateRequest(BaseModel):
    claim_id: str


@router.post("", status_code=201)
async def create_claim(body: ClaimCreate, user=Depends(get_provider)):
    db = get_db()

    claim_doc = {
        "provider_id": user["_id"],
        "patient_name": body.patient_name,
        "payer": body.payer,
        "claim_number": body.claim_number,
        "amount": body.amount,
        "service_description": body.service_description,
        "service_date": body.service_date,
        "denial_reason": body.denial_reason,
        "status": body.status,
        "actions_taken": [],
        "appeal_letter": None,
        "recovered_amount": 0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    result = await db.claims.insert_one(claim_doc)

    return {
        "id": str(result.inserted_id),
        "status": body.status,
        "message": "Claim recorded",
    }


@router.get("")
async def list_claims(
    status: str | None = None,
    limit: int = Query(50, le=100),
    skip: int = Query(0, ge=0),
    user=Depends(get_provider),
):
    db = get_db()
    query: dict = {}
    if user["role"] == "provider":
        query["provider_id"] = user["_id"]
    if status:
        query["status"] = status

    cursor = db.claims.find(query).sort("created_at", -1).skip(skip).limit(limit)
    claims = await cursor.to_list(length=limit)

    return [
        {
            "id": str(c["_id"]),
            "patient_name": c["patient_name"],
            "payer": c["payer"],
            "amount": c["amount"],
            "denial_reason": c.get("denial_reason", ""),
            "status": c["status"],
            "recovered_amount": c.get("recovered_amount", 0),
            "created_at": c["created_at"].isoformat(),
        }
        for c in claims
    ]


@router.post("/analyze")
async def analyze_denial(body: DenialAnalyzeRequest, user=Depends(get_provider)):
    """AI analyzes a denied claim and recommends next action."""
    db = get_db()

    claim = await db.claims.find_one({"_id": ObjectId(body.claim_id)})
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    if not claim.get("denial_reason"):
        raise HTTPException(status_code=400, detail="No denial reason to analyze")

    result = await detect_denial_action(
        denial_reason=claim["denial_reason"],
        payer=claim["payer"],
        amount=claim["amount"],
    )

    # Log action
    await db.claims.update_one(
        {"_id": claim["_id"]},
        {
            "$push": {
                "actions_taken": {
                    "type": "ai_analysis",
                    "result": result,
                    "timestamp": datetime.now(timezone.utc),
                }
            },
            "$set": {"updated_at": datetime.now(timezone.utc)},
        },
    )

    return {"claim_id": body.claim_id, "analysis": result}


@router.post("/generate-appeal")
async def generate_appeal(body: AppealGenerateRequest, user=Depends(get_provider)):
    """AI generates an appeal letter for a denied claim."""
    db = get_db()

    claim = await db.claims.find_one({"_id": ObjectId(body.claim_id)})
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    # Get provider name
    provider_user = await db.users.find_one({"_id": claim["provider_id"]})
    provider_name = f"{provider_user['first_name']} {provider_user['last_name']}" if provider_user else "Provider"

    letter = await generate_appeal_letter(
        patient_name=claim["patient_name"],
        provider_name=provider_name,
        payer=claim["payer"],
        denial_reason=claim.get("denial_reason", ""),
        service_description=claim["service_description"],
        amount=claim["amount"],
        service_date=claim["service_date"],
    )

    # Save appeal
    await db.claims.update_one(
        {"_id": claim["_id"]},
        {
            "$set": {
                "appeal_letter": letter,
                "status": "appealed",
                "updated_at": datetime.now(timezone.utc),
            },
            "$push": {
                "actions_taken": {
                    "type": "appeal_generated",
                    "timestamp": datetime.now(timezone.utc),
                }
            },
        },
    )

    return {"claim_id": body.claim_id, "appeal_letter": letter, "status": "appealed"}


@router.get("/analytics")
async def claims_analytics(user=Depends(get_provider)):
    db = get_db()

    query = {"provider_id": user["_id"]} if user["role"] == "provider" else {}

    total = await db.claims.count_documents(query)
    denied = await db.claims.count_documents({**query, "status": "denied"})
    appealed = await db.claims.count_documents({**query, "status": "appealed"})
    recovered = await db.claims.count_documents({**query, "status": "recovered"})

    # Total $ recovered
    pipeline = [
        {"$match": {**query, "status": "recovered"}},
        {"$group": {"_id": None, "total": {"$sum": "$recovered_amount"}}},
    ]
    recovered_result = await db.claims.aggregate(pipeline).to_list(length=1)
    total_recovered = recovered_result[0]["total"] if recovered_result else 0

    # Total $ denied
    denied_pipeline = [
        {"$match": {**query, "status": {"$in": ["denied", "appealed"]}}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
    ]
    denied_result = await db.claims.aggregate(denied_pipeline).to_list(length=1)
    total_denied = denied_result[0]["total"] if denied_result else 0

    return {
        "total_claims": total,
        "denied": denied,
        "appealed": appealed,
        "recovered": recovered,
        "recovery_rate": round((recovered / denied * 100), 1) if denied > 0 else 0,
        "total_recovered_amount": total_recovered,
        "total_denied_amount": total_denied,
    }
