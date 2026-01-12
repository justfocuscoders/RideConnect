from datetime import date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.models.ride import Ride
from app.db.models.payment import Payment


def get_driver_earnings_last_7_days(db: Session, driver_id: int):
    today = date.today()
    start_date = today - timedelta(days=6)

    rows = (
        db.query(
            func.date(Payment.created_at).label("day"),
            func.coalesce(func.sum(Payment.amount), 0).label("total"),
        )
        .join(Ride, Ride.id == Payment.ride_id)
        .filter(
            Ride.driver_id == driver_id,
            Ride.status == "completed",
            func.date(Payment.created_at) >= start_date,
        )
        .group_by(func.date(Payment.created_at))
        .all()
    )

    earnings_map = {
        row.day.isoformat(): float(row.total) for row in rows
    }

    days = []
    for i in range(7):
        d = start_date + timedelta(days=i)
        days.append({
            "date": d.isoformat(),
            "total": earnings_map.get(d.isoformat(), 0),
        })

    return {"days": days}


