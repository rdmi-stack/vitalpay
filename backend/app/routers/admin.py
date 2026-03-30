from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.core.deps import get_admin
from app.core.security import hash_password

router = APIRouter(prefix="/admin", tags=["Admin"])


class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str
    role: str
    first_name: str
    last_name: str


class UpdateUserRequest(BaseModel):
    is_active: bool | None = None
    role: str | None = None


@router.get("/users")
async def list_users(
    limit: int = Query(50, le=200),
    skip: int = Query(0, ge=0),
    user=Depends(get_admin),
):
    db = get_db()
    cursor = db.users.find({}, {"password_hash": 0}).sort("created_at", -1).skip(skip).limit(limit)
    users = await cursor.to_list(length=limit)

    return [
        {
            "id": str(u["_id"]),
            "email": u["email"],
            "role": u["role"],
            "first_name": u["first_name"],
            "last_name": u["last_name"],
            "is_active": u.get("is_active", True),
            "created_at": u["created_at"].isoformat(),
        }
        for u in users
    ]


@router.post("/users", status_code=201)
async def create_user(body: CreateUserRequest, user=Depends(get_admin)):
    db = get_db()

    existing = await db.users.find_one({"email": body.email.lower()})
    if existing:
        raise HTTPException(status_code=409, detail="Email already exists")

    user_doc = {
        "email": body.email.lower(),
        "password_hash": hash_password(body.password),
        "role": body.role,
        "first_name": body.first_name,
        "last_name": body.last_name,
        "is_active": True,
        "email_verified": False,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    result = await db.users.insert_one(user_doc)

    return {
        "id": str(result.inserted_id),
        "email": body.email.lower(),
        "role": body.role,
    }


@router.patch("/users/{user_id}")
async def update_user(user_id: str, body: UpdateUserRequest, user=Depends(get_admin)):
    db = get_db()

    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)

    result = await db.users.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {"$set": update_data},
        return_document=True,
    )

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(result["_id"]),
        "email": result["email"],
        "is_active": result.get("is_active", True),
        "role": result["role"],
    }
