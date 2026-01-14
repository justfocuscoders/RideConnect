from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.db.repositories.admin_driver_ride_analytics import get_drivers_summary
from app.schemas.admin_driver_ride_analytics import DriversSummaryOut

router = APIRouter(prefix="/drivers")

@router.get("/summary", response_model=DriversSummaryOut)
def drivers_summary(db: Session = Depends(get_db)):
    return get_drivers_summary(db)
