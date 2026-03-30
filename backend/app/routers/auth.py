from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.schemas.auth import (
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(body: RegisterRequest):
    db = get_db()

    # Check if email exists
    existing = await db.users.find_one({"email": body.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # Validate role
    if body.role not in ("patient", "provider", "admin"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role",
        )

    # Create user
    user_doc = {
        "email": body.email.lower(),
        "password_hash": hash_password(body.password),
        "role": body.role,
        "first_name": body.first_name,
        "last_name": body.last_name,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    # Create audit log
    await db.audit_logs.insert_one(
        {
            "action": "user_registered",
            "user_id": user_id,
            "details": {"email": body.email.lower(), "role": body.role},
            "timestamp": datetime.now(timezone.utc),
        }
    )

    # Send verification email
    from app.routers.password_reset import send_verification_email
    try:
        await send_verification_email(result.inserted_id, body.email.lower(), body.first_name)
    except Exception:
        pass  # Don't fail registration if email fails

    # Generate tokens
    token_data = {"sub": user_id, "email": body.email.lower(), "role": body.role}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    db = get_db()

    user = await db.users.find_one({"email": body.email.lower()})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account disabled",
        )

    user_id = str(user["_id"])
    token_data = {"sub": user_id, "email": user["email"], "role": user["role"]}

    # Update last login
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.now(timezone.utc)}},
    )

    # Audit log
    await db.audit_logs.insert_one(
        {
            "action": "user_login",
            "user_id": user_id,
            "timestamp": datetime.now(timezone.utc),
        }
    )

    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(body: RefreshRequest):
    payload = decode_token(body.refresh_token)

    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    db = get_db()
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    token_data = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
    }

    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(user=Depends(get_current_user)):
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        role=user["role"],
        first_name=user["first_name"],
        last_name=user["last_name"],
        is_active=user.get("is_active", True),
        created_at=user["created_at"].isoformat(),
    )
