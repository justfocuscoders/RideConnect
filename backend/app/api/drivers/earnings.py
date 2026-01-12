from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.dependencies import get_current_driver
from app.db.repositories.driver_earning import (
    get_driver_earnings,
    get_driver_total_earnings,
)
from app.services.driver_earnings import get_driver_earnings_last_7_days

router = APIRouter(prefix="/earnings", tags=["Driver Earnings"])


@router.get("")
def driver_earnings_summary(
    db: Session = Depends(get_db),
    current_driver=Depends(get_current_driver),
):
    earnings = get_driver_earnings(db, current_driver.id)
    total = get_driver_total_earnings(db, current_driver.id)

    return {
        "total_earnings": total,
        "history": earnings,
    }


@router.get("/last-7-days")
def driver_earnings_last_7_days(
    db: Session = Depends(get_db),
    driver=Depends(get_current_driver),
):
    return get_driver_earnings_last_7_days(db, driver.id)
