from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.api.dependencies import get_db
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

router = APIRouter(prefix="/revenue")

@router.get("/total", response_model=TotalRevenueOut)
def total_revenue(db: Session = Depends(get_db)):
    return get_total_revenue(db)

@router.get("/daily", response_model=list[DailyRevenueOut])
def daily_revenue(db: Session = Depends(get_db)):
    return get_daily_revenue(db)

@router.get("/range", response_model=RevenueRangeOut)
def revenue_range(
    from_date: date = Query(...),
    to_date: date = Query(...),
    db: Session = Depends(get_db),
):
    if from_date > to_date:
        raise HTTPException(400, "Invalid date range")
    return get_revenue_by_date_range(db, from_date, to_date)
