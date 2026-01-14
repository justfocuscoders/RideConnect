from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.db.repositories.admin_driver_ride_analytics import get_platform_earnings
from app.schemas.admin_driver_ride_analytics import PlatformEarningsOut

router = APIRouter(prefix="/platform")

@router.get("/earnings", response_model=PlatformEarningsOut)
def platform_earnings(db: Session = Depends(get_db)):
    return get_platform_earnings(db)
