from datetime import datetime
from pydantic import BaseModel


class DriverEarningOut(BaseModel):
    payment_id: int
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True
