# app/api/routes/admin_analytics.py

from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_admin
from app.db.repositories.admin_analytics import (
    get_total_revenue,
    get_daily_revenue,
    get_revenue_by_date_range
)
from app.schemas.admin_analytics import (
    TotalRevenueOut,
    DailyRevenueOut,
    RevenueRangeOut
)

router = APIRouter(
    prefix="/admin/analytics",
    tags=["Admin Analytics"],
    dependencies=[Depends(get_current_admin)]
)


# -------------------------------------------------
# TOTAL REVENUE
# -------------------------------------------------
@router.get(
    "/revenue/total",
    response_model=TotalRevenueOut
)
def read_total_revenue(db: Session = Depends(get_db)):
    return get_total_revenue(db)


# -------------------------------------------------
# DAILY REVENUE
# -------------------------------------------------
@router.get(
    "/revenue/daily",
    response_model=list[DailyRevenueOut]
)
def read_daily_revenue(db: Session = Depends(get_db)):
    return get_daily_revenue(db)


# -------------------------------------------------
# DATE RANGE REVENUE
# -------------------------------------------------
@router.get(
    "/revenue/range",
    response_model=RevenueRangeOut
)
def read_revenue_by_date_range(
    from_date: date = Query(..., description="Start date (YYYY-MM-DD)"),
    to_date: date = Query(..., description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    if from_date > to_date:
        raise HTTPException(
            status_code=400,
            detail="from_date must be before or equal to to_date"
        )

    return get_revenue_by_date_range(db, from_date, to_date)
