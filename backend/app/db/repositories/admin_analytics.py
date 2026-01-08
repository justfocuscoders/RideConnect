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
    results = (
        db.query(
            func.date(Payment.created_at).label("day"),
            func.coalesce(func.sum(Payment.amount), 0).label("revenue"),
            func.count(Payment.id).label("payments")
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

        if isinstance(day_value, str):
            day_value = date.fromisoformat(day_value)
        elif isinstance(day_value, datetime):
            day_value = day_value.date()

        response.append(
            {
                "date": day_value,
                "revenue": float(row.revenue),
                "payments": row.payments
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
