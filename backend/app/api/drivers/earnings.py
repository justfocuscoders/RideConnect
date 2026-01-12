from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.dependencies import get_current_driver
from app.db.repositories.driver_earning import (
    get_driver_earnings,
    get_driver_total_earnings,
)
from app.services.driver_earnings import (
    get_driver_earnings_last_7_days,
    get_driver_earnings_details,
)

router = APIRouter(prefix="/earnings", tags=["Driver Earnings"])


# =========================================================
# SUMMARY (EXISTING — UNCHANGED)
# =========================================================
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


# =========================================================
# LAST 7 DAYS (STEP 9.6 — WRAPPER)
# =========================================================
@router.get("/last-7-days")
def driver_earnings_last_7_days_route(
    db: Session = Depends(get_db),
    driver=Depends(get_current_driver),
):
    return get_driver_earnings_last_7_days(db, driver.id)


# =========================================================
# EARNINGS DETAILS (STEP 9.7 — CORE ENGINE)
# =========================================================
@router.get("/details")
def driver_earnings_details_route(
    start_date: date = Query(...),
    end_date: date = Query(...),
    granularity: str | None = Query(None),
    db: Session = Depends(get_db),
    driver=Depends(get_current_driver),
):
    return get_driver_earnings_details(
        db=db,
        driver_id=driver.id,
        start_date=start_date,
        end_date=end_date,
        granularity=granularity,
    )
