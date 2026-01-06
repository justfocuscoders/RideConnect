# app/schemas/admin_analytics.py

from datetime import date
from typing import List
from pydantic import BaseModel


# -------------------------------------------------
# TOTAL REVENUE
# -------------------------------------------------
class TotalRevenueOut(BaseModel):
    total_revenue: float
    total_payments: int


# -------------------------------------------------
# DAILY REVENUE
# -------------------------------------------------
class DailyRevenueOut(BaseModel):
    date: date
    daily_revenue: float
    payment_count: int


# -------------------------------------------------
# DATE RANGE REVENUE
# -------------------------------------------------
class RevenueRangeOut(BaseModel):
    from_date: date
    to_date: date
    total_revenue: float
    total_payments: int
