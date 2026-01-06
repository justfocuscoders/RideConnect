# app/schemas/admin_driver_ride_analytics.py

from datetime import date
from typing import Dict, List
from pydantic import BaseModel


# -------------------------------------------------
# RIDES ANALYTICS
# -------------------------------------------------
class RidesSummaryOut(BaseModel):
    total_rides: int
    by_status: Dict[str, int]


class DailyRidesOut(BaseModel):
    date: date
    ride_count: int


# -------------------------------------------------
# DRIVERS ANALYTICS
# -------------------------------------------------
class DriversSummaryOut(BaseModel):
    total_drivers: int
    online_drivers: int
    offline_drivers: int


class DriverEarningsOut(BaseModel):
    driver_id: int
    total_earning: float


# -------------------------------------------------
# PLATFORM ANALYTICS
# -------------------------------------------------
class PlatformEarningsOut(BaseModel):
    total_driver_payout: float
    completed_rides: int
