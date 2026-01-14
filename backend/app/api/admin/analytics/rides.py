from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.db.repositories.admin_driver_ride_analytics import (
    get_rides_summary,
    get_daily_rides
)
from app.schemas.admin_driver_ride_analytics import (
    RidesSummaryOut,
    DailyRidesOut
)

router = APIRouter(prefix="/rides")

@router.get("/summary", response_model=RidesSummaryOut)
def rides_summary(db: Session = Depends(get_db)):
    return get_rides_summary(db)

@router.get("/daily", response_model=list[DailyRidesOut])
def rides_daily(db: Session = Depends(get_db)):
    return get_daily_rides(db)
