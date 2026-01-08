from datetime import date, datetime
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.models.payment import Payment


# -------------------------------------------------
# TOTAL REVENUE (LIFETIME)
# -------------------------------------------------
def get_total_revenue(db: Session):
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
# DAILY REVENUE BREAKDOWN (MYSQL SAFE + REAL)
# -------------------------------------------------
def get_daily_revenue(db: Session):
    """
    Real daily revenue using Payment.created_at
    - MySQL safe
    - Schema safe
    - No 500 errors
    """
    results = (
        db.query(
            func.date(Payment.created_at).label("day"),
            func.count(Payment.id).label("payment_count"),
            func.coalesce(func.sum(Payment.amount), 0).label("daily_revenue")
        )
        .filter(Payment.status == "completed")
        .filter(Payment.created_at.isnot(None))
        .group_by(func.date(Payment.created_at))
        .order_by(func.date(Payment.created_at))
        .all()
    )

    response = []

    for row in results:
        day_value = row.day

        # Normalize MySQL return type
        if isinstance(day_value, str):
            day_value = date.fromisoformat(day_value)
        elif isinstance(day_value, datetime):
            day_value = day_value.date()

        response.append(
            {
                "date": date.today(),
                "daily_revenue": float(row.daily_revenue),
                "payment_count": row.payment_count
            }
        )

    return response


# -------------------------------------------------
# DATE RANGE REVENUE (MYSQL SAFE)
# -------------------------------------------------
def get_revenue_by_date_range(
    db: Session,
    from_date: date,
    to_date: date
):
    result = (
        db.query(
            func.coalesce(func.sum(Payment.amount), 0).label("total_revenue"),
            func.count(Payment.id).label("total_payments")
        )
        .filter(Payment.status == "completed")
        .filter(Payment.created_at.isnot(None))
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
