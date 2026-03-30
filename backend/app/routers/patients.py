from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.database import get_db
from app.core.deps import get_current_user, get_provider

from app.schemas.patient import PatientCreate, PatientResponse, PatientUpdate

router = APIRouter(prefix="/patients", tags=["Patients"])


def _patient_to_response(p: dict) -> PatientResponse:
    return PatientResponse(
        id=str(p["_id"]),
        first_name=p["first_name"],
        last_name=p["last_name"],
        date_of_birth=p["date_of_birth"],
        phone=p["phone"],
        email=p["email"],
        address=p.get("address"),
        provider_ids=[str(pid) for pid in p.get("provider_ids", [])],
        created_at=p["created_at"].isoformat(),
    )


@router.post("", response_model=PatientResponse, status_code=201)
async def create_patient(body: PatientCreate, user=Depends(get_provider)):
    db = get_db()

    # Check if patient exists by email
    existing = await db.patients.find_one({"email": body.email.lower()})
    if existing:
        # Link to this provider if not already
        if user["_id"] not in existing.get("provider_ids", []):
            await db.patients.update_one(
                {"_id": existing["_id"]},
                {"$addToSet": {"provider_ids": user["_id"]}},
            )
            existing["provider_ids"] = existing.get("provider_ids", []) + [user["_id"]]
        return _patient_to_response(existing)

    patient_doc = {
        "first_name": body.first_name,
        "last_name": body.last_name,
        "date_of_birth": body.date_of_birth,
        "phone": body.phone,
        "email": body.email.lower(),
        "address": body.address,
        "provider_ids": [user["_id"]],
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    result = await db.patients.insert_one(patient_doc)
    patient_doc["_id"] = result.inserted_id

    return _patient_to_response(patient_doc)


@router.get("", response_model=list[PatientResponse])
async def list_patients(
    limit: int = Query(50, le=100),
    skip: int = Query(0, ge=0),
    user=Depends(get_provider),
):
    db = get_db()
    query = {"provider_ids": user["_id"]}

    cursor = db.patients.find(query).sort("created_at", -1).skip(skip).limit(limit)
    patients = await cursor.to_list(length=limit)
    return [_patient_to_response(p) for p in patients]


@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(patient_id: str, user=Depends(get_current_user)):
    db = get_db()
    patient = await db.patients.find_one({"_id": ObjectId(patient_id)})

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return _patient_to_response(patient)


@router.patch("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: str, body: PatientUpdate, user=Depends(get_provider)
):
    db = get_db()

    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)

    result = await db.patients.find_one_and_update(
        {"_id": ObjectId(patient_id)},
        {"$set": update_data},
        return_document=True,
    )

    if not result:
        raise HTTPException(status_code=404, detail="Patient not found")

    return _patient_to_response(result)


@router.post("/verify-dob")
async def verify_patient_dob(pay_code: str, date_of_birth: str):
    """Public endpoint — verify patient DOB for payment link access."""
    db = get_db()

    bill = await db.bills.find_one({"pay_code": pay_code})
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    patient = await db.patients.find_one({"_id": bill["patient_id"]})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if patient["date_of_birth"] != date_of_birth:
        raise HTTPException(status_code=401, detail="Date of birth does not match")

    return {
        "verified": True,
        "patient_name": f"{patient['first_name']} {patient['last_name']}",
        "bill": {
            "id": str(bill["_id"]),
            "amount_due": bill.get("amount_due", bill["amount"]),
            "service_description": bill["service_description"],
            "provider_name": bill["provider_name"],
        },
    }
