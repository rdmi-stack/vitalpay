import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.core.security import hash_password
from app.services.email import _send_mailgun

router = APIRouter(prefix="/auth", tags=["Authentication"])

FRONTEND_URL = "http://localhost:3000"


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class VerifyEmailRequest(BaseModel):
    token: str


@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordRequest):
    db = get_db()

    user = await db.users.find_one({"email": body.email.lower()})
    if not user:
        # Don't reveal if email exists
        return {"message": "If that email exists, a reset link has been sent."}

    # Generate reset token
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + timedelta(hours=1)

    await db.password_resets.insert_one({
        "user_id": user["_id"],
        "token": token,
        "expires_at": expires,
        "used": False,
        "created_at": datetime.now(timezone.utc),
    })

    # Send reset email
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"
    html = f"""
    <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <span style="background: #635bff; color: white; padding: 6px 10px; border-radius: 8px; font-weight: bold; font-size: 14px;">+</span>
            <span style="font-weight: bold; font-size: 18px; margin-left: 8px; color: #0a2540;">PayVital</span>
        </div>
        <div style="background: #f7f9fc; border-radius: 16px; padding: 32px; text-align: center;">
            <h2 style="color: #0a2540; margin: 0 0 12px;">Reset Your Password</h2>
            <p style="color: #6b7c93; font-size: 14px; margin: 0 0 24px;">Click the button below to set a new password. This link expires in 1 hour.</p>
            <a href="{reset_link}" style="display: inline-block; background: #635bff; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px;">Reset Password</a>
        </div>
        <p style="text-align: center; color: #a3b1c6; font-size: 12px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
    """

    await _send_mailgun(body.email, "Reset your PayVital password", html)

    return {"message": "If that email exists, a reset link has been sent."}


@router.post("/reset-password")
async def reset_password(body: ResetPasswordRequest):
    db = get_db()

    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    reset_doc = await db.password_resets.find_one({
        "token": body.token,
        "used": False,
        "expires_at": {"$gt": datetime.now(timezone.utc)},
    })

    if not reset_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    # Update password
    await db.users.update_one(
        {"_id": reset_doc["user_id"]},
        {"$set": {"password_hash": hash_password(body.new_password), "updated_at": datetime.now(timezone.utc)}},
    )

    # Mark token as used
    await db.password_resets.update_one(
        {"_id": reset_doc["_id"]},
        {"$set": {"used": True}},
    )

    return {"message": "Password reset successfully. You can now login."}


@router.post("/verify-email")
async def verify_email(body: VerifyEmailRequest):
    db = get_db()

    verification = await db.email_verifications.find_one({
        "token": body.token,
        "used": False,
        "expires_at": {"$gt": datetime.now(timezone.utc)},
    })

    if not verification:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")

    # Mark email as verified
    await db.users.update_one(
        {"_id": verification["user_id"]},
        {"$set": {"email_verified": True, "updated_at": datetime.now(timezone.utc)}},
    )

    # Mark token as used
    await db.email_verifications.update_one(
        {"_id": verification["_id"]},
        {"$set": {"used": True}},
    )

    return {"message": "Email verified successfully."}


async def send_verification_email(user_id, email: str, first_name: str):
    """Called after registration to send verification email."""
    from app.core.database import get_db
    db = get_db()

    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + timedelta(hours=24)

    await db.email_verifications.insert_one({
        "user_id": user_id,
        "token": token,
        "expires_at": expires,
        "used": False,
        "created_at": datetime.now(timezone.utc),
    })

    verify_link = f"{FRONTEND_URL}/verify-email?token={token}"
    html = f"""
    <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <span style="background: #635bff; color: white; padding: 6px 10px; border-radius: 8px; font-weight: bold; font-size: 14px;">+</span>
            <span style="font-weight: bold; font-size: 18px; margin-left: 8px; color: #0a2540;">PayVital</span>
        </div>
        <div style="background: #f7f9fc; border-radius: 16px; padding: 32px; text-align: center;">
            <h2 style="color: #0a2540; margin: 0 0 12px;">Welcome to PayVital!</h2>
            <p style="color: #6b7c93; font-size: 14px; margin: 0 0 24px;">Hi {first_name}, please verify your email address to get started.</p>
            <a href="{verify_link}" style="display: inline-block; background: #635bff; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px;">Verify Email</a>
        </div>
    </div>
    """

    await _send_mailgun(email, "Verify your PayVital email", html)
