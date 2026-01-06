# app/db/repositories/admin_analytics.py

from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date

from app.db.models.payment import Payment


# -------------------------------------------------
# TOTAL REVENUE (LIFETIME)
# -------------------------------------------------
def get_total_revenue(db: Session):
    """
    Returns:
        {
            total_revenue: float,
            total_payments: int
        }
    """
    result = (
        db.query(
            func.coalesce(func.sum(Payment.amount), 0).label("total_revenue"),
            func.count(Payment.id).label("total_payments")
        )
        .filter(Payment.status == "completed")
        .one()
    )

    return {
        "total_revenue": float(result.total_revenue),
        "total_payments": result.total_payments
    }


# -------------------------------------------------
# DAILY REVENUE BREAKDOWN
# -------------------------------------------------
def get_daily_revenue(db: Session):
    """
    Returns list of:
        {
            date: YYYY-MM-DD,
            daily_revenue: float,
            payment_count: int
        }
    """
    results = (
        db.query(
            cast(Payment.created_at, Date).label("date"),
            func.coalesce(func.sum(Payment.amount), 0).label("daily_revenue"),
            func.count(Payment.id).label("payment_count")
        )
        .filter(Payment.status == "completed")
        .group_by(cast(Payment.created_at, Date))
        .order_by(cast(Payment.created_at, Date).desc())
        .all()
    )

    return [
        {
            "date": row.date,
            "daily_revenue": float(row.daily_revenue),
            "payment_count": row.payment_count
        }
        for row in results
    ]


# -------------------------------------------------
# DATE RANGE REVENUE
# -------------------------------------------------
def get_revenue_by_date_range(
    db: Session,
    from_date: date,
    to_date: date
):
    """
    Returns:
        {
            from_date: date,
            to_date: date,
            total_revenue: float,
            total_payments: int
        }
    """
    result = (
        db.query(
            func.coalesce(func.sum(Payment.amount), 0).label("total_revenue"),
            func.count(Payment.id).label("total_payments")
        )
        .filter(Payment.status == "completed")
        .filter(cast(Payment.created_at, Date) >= from_date)
        .filter(cast(Payment.created_at, Date) <= to_date)
        .one()
    )

    return {
        "from_date": from_date,
        "to_date": to_date,
        "total_revenue": float(result.total_revenue),
        "total_payments": result.total_payments
    }
