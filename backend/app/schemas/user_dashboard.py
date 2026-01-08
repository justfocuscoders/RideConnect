from pydantic import BaseModel
from typing import List
from datetime import date


class UserDashboardSummary(BaseModel):
    total_rides: int
    completed_rides: int
    cancelled_rides: int
    total_spent: float


class UserRideItem(BaseModel):
    id: int
    status: str
    pickup_location: str
    dropoff_location: str
    created_at: date


class UserPaymentItem(BaseModel):
    id: int
    amount: float
    payment_method: str
    created_at: date
