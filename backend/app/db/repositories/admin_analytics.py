from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func

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
# DAILY REVENUE BREAKDOWN (MYSQL SAFE)
# -------------------------------------------------
def get_daily_revenue(db: Session):
    """
    Safe version:
    - Works even if Payment has no created_at
    - Groups everything as a single day
    """
    result = (
        db.query(
            func.count(Payment.id).label("payment_count"),
            func.coalesce(func.sum(Payment.amount), 0).label("daily_revenue")
        )
        .filter(Payment.status == "completed")
        .one()
    )

    return [
        {
            "date": date.today().isoformat(),
            "daily_revenue": float(result.daily_revenue or 0),
            "payment_count": result.payment_count or 0
        }
    ]




# -------------------------------------------------
# DATE RANGE REVENUE (MYSQL SAFE)
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
        .filter(func.date(Payment.created_at) >= from_date)
        .filter(func.date(Payment.created_at) <= to_date)
        .one()
    )

    return {
        "from_date": from_date,
        "to_date": to_date,
        "total_revenue": float(result.total_revenue),
        "total_payments": result.total_payments
    }
