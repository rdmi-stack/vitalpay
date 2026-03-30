from pydantic import BaseModel
from typing import Optional


class BillCreate(BaseModel):
    patient_id: str
    amount: float
    service_description: str
    service_date: str
    insurance_adjustment: float = 0
    due_date: str
    provider_name: str


class BillUpdate(BaseModel):
    amount: Optional[float] = None
    status: Optional[str] = None  # pending | sent | viewed | paid | overdue | collections
    insurance_adjustment: Optional[float] = None
    due_date: Optional[str] = None


class BillResponse(BaseModel):
    id: str
    patient_id: str
    provider_id: str
    amount: float
    amount_due: float
    service_description: str
    service_date: str
    insurance_adjustment: float
    status: str
    due_date: str
    provider_name: str
    payment_link: Optional[str] = None
    created_at: str
