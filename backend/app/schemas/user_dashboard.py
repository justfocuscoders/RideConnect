from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UserDashboardSummary(BaseModel):
    total_rides: int
    completed_rides: int
    cancelled_rides: int
    total_spent: float


class UserRideItem(BaseModel):
    id: int
    status: str
    pickup_location: str
    dropoff_location: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserPaymentItem(BaseModel):
    id: int
    amount: float
    payment_method: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
