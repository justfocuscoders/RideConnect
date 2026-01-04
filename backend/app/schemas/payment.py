from datetime import datetime
from pydantic import BaseModel


class PaymentOut(BaseModel):
    id: int
    ride_id: int
    amount: float
    commission: float
    driver_earning: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class PaymentMarkPaid(BaseModel):
    status: str  # must be "paid"
