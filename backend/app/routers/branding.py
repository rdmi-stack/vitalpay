"""Provider white-label branding — custom logo, colors, and name on patient-facing pages."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.database import get_db
from app.core.deps import get_provider

router = APIRouter(prefix="/branding", tags=["Branding"])


class BrandingUpdate(BaseModel):
    display_name: str | None = None
    logo_url: str | None = None
    primary_color: str | None = None  # hex e.g. #635bff
    accent_color: str | None = None
    support_phone: str | None = None
    support_email: str | None = None


@router.get("")
async def get_branding(user=Depends(get_provider)):
    db = get_db()
    branding = await db.provider_branding.find_one({"provider_id": user["_id"]})

    if not branding:
        return {
            "display_name": f"{user['first_name']} {user['last_name']}",
            "logo_url": None,
            "primary_color": "#635bff",
            "accent_color": "#00d4aa",
            "support_phone": "(888) 730-9374",
            "support_email": "support@payvital.com",
        }

    return {
        "display_name": branding.get("display_name", ""),
        "logo_url": branding.get("logo_url"),
        "primary_color": branding.get("primary_color", "#635bff"),
        "accent_color": branding.get("accent_color", "#00d4aa"),
        "support_phone": branding.get("support_phone", ""),
        "support_email": branding.get("support_email", ""),
    }


@router.put("")
async def update_branding(body: BrandingUpdate, user=Depends(get_provider)):
    db = get_db()

    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    update_data["provider_id"] = user["_id"]
    update_data["updated_at"] = datetime.now(timezone.utc)

    await db.provider_branding.update_one(
        {"provider_id": user["_id"]},
        {"$set": update_data},
        upsert=True,
    )

    return {"status": "updated", **update_data}


@router.get("/public/{pay_code}")
async def get_public_branding(pay_code: str):
    """Public endpoint — get provider branding for patient payment page."""
    db = get_db()
    bill = await db.bills.find_one({"pay_code": pay_code})
    if not bill:
        return {"display_name": "PayVital", "primary_color": "#635bff"}

    branding = await db.provider_branding.find_one({"provider_id": bill["provider_id"]})
    if not branding:
        return {
            "display_name": bill["provider_name"],
            "logo_url": None,
            "primary_color": "#635bff",
            "accent_color": "#00d4aa",
            "support_phone": "(888) 730-9374",
            "support_email": "support@payvital.com",
        }

    return {
        "display_name": branding.get("display_name", bill["provider_name"]),
        "logo_url": branding.get("logo_url"),
        "primary_color": branding.get("primary_color", "#635bff"),
        "accent_color": branding.get("accent_color", "#00d4aa"),
        "support_phone": branding.get("support_phone", ""),
        "support_email": branding.get("support_email", ""),
    }
