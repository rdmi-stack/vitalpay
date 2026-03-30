from pydantic import BaseModel, EmailStr
from typing import Optional


class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: str  # YYYY-MM-DD
    phone: str
    email: EmailStr
    address: Optional[str] = None


class PatientUpdate(BaseModel):
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None


class PatientResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    date_of_birth: str
    phone: str
    email: str
    address: Optional[str] = None
    provider_ids: list[str] = []
    created_at: str
