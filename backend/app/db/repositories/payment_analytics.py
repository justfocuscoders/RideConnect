from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import date

from app.db.models.payment import Payment


def get_payment_summary(
    db: Session,
    user_id: int,
    from_date: date,
    to_date: date
):
    daily = (
        db.query(
            cast(Payment.created_at, Date).label("date"),
            func.sum(Payment.amount).label("total_amount")
        )
        .filter(
            Payment.user_id == user_id,
            Payment.created_at >= from_date,
            Payment.created_at <= to_date
        )
        .group_by(cast(Payment.created_at, Date))
        .order_by(cast(Payment.created_at, Date))
        .all()
    )

    total_spent = sum(row.total_amount for row in daily)
    total_rides = len(daily)

    return {
        "total_spent": total_spent,
        "total_rides": total_rides,
        "daily_breakdown": daily
    }


def get_payment_rides(
    db: Session,
    user_id: int,
    from_date: date,
    to_date: date
):
    return (
        db.query(
            Payment.ride_id,
            Payment.amount,
            cast(Payment.created_at, Date).label("paid_at")
        )
        .filter(
            Payment.user_id == user_id,
            Payment.created_at >= from_date,
            Payment.created_at <= to_date
        )
        .order_by(Payment.created_at.desc())
        .all()
    )
