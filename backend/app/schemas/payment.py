from pydantic import BaseModel
from typing import Optional


class PaymentCreate(BaseModel):
    bill_id: str
    amount: float
    method: str = "card"  # card | ach | apple_pay | hsa


class PaymentResponse(BaseModel):
    id: str
    bill_id: str
    patient_id: str
    amount: float
    method: str
    status: str  # pending | completed | failed | refunded
    stripe_payment_id: Optional[str] = None
    created_at: str


class PaymentPlanCreate(BaseModel):
    bill_id: str
    total_amount: float
    installments: int  # 3, 6, or 12
    frequency: str = "monthly"  # monthly | biweekly


class PaymentPlanResponse(BaseModel):
    id: str
    bill_id: str
    patient_id: str
    total_amount: float
    installment_amount: float
    installments: int
    installments_paid: int
    frequency: str
    status: str  # active | completed | defaulted | cancelled
    next_due_date: str
    created_at: str
