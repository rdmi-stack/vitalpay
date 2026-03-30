from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

from app.core.database import get_db

router = APIRouter(prefix="/contact", tags=["Contact"])


class DemoRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str = ""
    organization: str
    ehr_system: str = ""
    provider_count: str = ""
    message: str = ""


@router.post("/demo", status_code=201)
async def request_demo(body: DemoRequest):
    db = get_db()

    lead = {
        "first_name": body.first_name,
        "last_name": body.last_name,
        "email": body.email.lower(),
        "phone": body.phone,
        "organization": body.organization,
        "ehr_system": body.ehr_system,
        "provider_count": body.provider_count,
        "message": body.message,
        "status": "new",
        "created_at": datetime.now(timezone.utc),
    }

    await db.leads.insert_one(lead)

    return {"status": "received", "message": "Thank you! Our team will reach out within 24 hours."}
