from datetime import date
from pydantic import BaseModel
from typing import List


class DailySpend(BaseModel):
    date: date
    total_amount: int


class PaymentSummaryOut(BaseModel):
    total_spent: int
    total_rides: int
    daily_breakdown: List[DailySpend]


class PaymentRideOut(BaseModel):
    ride_id: int
    amount: int
    paid_at: date
