# app/api/routes/admin_driver_ride_analytics.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_admin
from app.db.repositories.admin_driver_ride_analytics import (
    get_rides_summary,
    get_daily_rides,
    get_drivers_summary,
    get_driver_earnings,
    get_platform_earnings
)
from app.schemas.admin_driver_ride_analytics import (
    RidesSummaryOut,
    DailyRidesOut,
    DriversSummaryOut,
    DriverEarningsOut,
    PlatformEarningsOut
)

router = APIRouter(
    prefix="/admin/analytics",
    tags=["Admin Analytics"],
    dependencies=[Depends(get_current_admin)]
)


# -------------------------------------------------
# RIDES
# -------------------------------------------------
@router.get(
    "/rides/summary",
    response_model=RidesSummaryOut
)
def read_rides_summary(db: Session = Depends(get_db)):
    return get_rides_summary(db)


@router.get(
    "/rides/daily",
    response_model=list[DailyRidesOut]
)
def read_daily_rides(db: Session = Depends(get_db)):
    return get_daily_rides(db)


# -------------------------------------------------
# DRIVERS
# -------------------------------------------------
@router.get(
    "/drivers/summary",
    response_model=DriversSummaryOut
)
def read_drivers_summary(db: Session = Depends(get_db)):
    return get_drivers_summary(db)


@router.get(
    "/drivers/earnings",
    response_model=list[DriverEarningsOut]
)
def read_driver_earnings(db: Session = Depends(get_db)):
    return get_driver_earnings(db)


# -------------------------------------------------
# PLATFORM
# -------------------------------------------------
@router.get(
    "/platform/earnings",
    response_model=PlatformEarningsOut
)
def read_platform_earnings(db: Session = Depends(get_db)):
    return get_platform_earnings(db)
