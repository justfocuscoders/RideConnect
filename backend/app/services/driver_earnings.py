from datetime import date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.models.ride import Ride
from app.db.models.payment import Payment


# =========================================================
# CORE ANALYTICS ENGINE (STEP 9.7)
# =========================================================

def infer_granularity(start_date: date, end_date: date) -> str:
    days = (end_date - start_date).days + 1
    if days <= 31:
        return "daily"
    if days <= 365:
        return "monthly"
    return "yearly"


def get_driver_earnings_details(
    db: Session,
    driver_id: int,
    start_date: date,
    end_date: date,
    granularity: str | None = None,
):
    if not granularity:
        granularity = infer_granularity(start_date, end_date)

    # -------------------------
    # DAILY
    # -------------------------
    if granularity == "daily":
        rows = (
            db.query(
                func.date(Payment.created_at).label("period"),
                func.count(Payment.id).label("rides"),
                func.coalesce(func.sum(Payment.amount), 0).label("earnings"),
            )
            .join(Ride, Ride.id == Payment.ride_id)
            .filter(
                Ride.driver_id == driver_id,
                Ride.status == "completed",
                func.date(Payment.created_at) >= start_date,
                func.date(Payment.created_at) <= end_date,
            )
            .group_by(func.date(Payment.created_at))
            .all()
        )

        row_map = {r.period: r for r in rows}

        data = []
        current = start_date
        while current <= end_date:
            row = row_map.get(current)
            data.append({
                "period": current.isoformat(),
                "rides": row.rides if row else 0,
                "earnings": float(row.earnings) if row else 0,
            })
            current += timedelta(days=1)

    # -------------------------
    # MONTHLY
    # -------------------------
    elif granularity == "monthly":
        rows = (
            db.query(
                func.to_char(Payment.created_at, "YYYY-MM").label("period"),
                func.count(Payment.id).label("rides"),
                func.coalesce(func.sum(Payment.amount), 0).label("earnings"),
            )
            .join(Ride, Ride.id == Payment.ride_id)
            .filter(
                Ride.driver_id == driver_id,
                Ride.status == "completed",
                Payment.created_at >= start_date,
                Payment.created_at <= end_date,
            )
            .group_by("period")
            .order_by("period")
            .all()
        )

        data = [
            {
                "period": r.period,
                "rides": r.rides,
                "earnings": float(r.earnings),
            }
            for r in rows
        ]

    # -------------------------
    # YEARLY
    # -------------------------
    else:
        rows = (
            db.query(
                func.extract("year", Payment.created_at).label("period"),
                func.count(Payment.id).label("rides"),
                func.coalesce(func.sum(Payment.amount), 0).label("earnings"),
            )
            .join(Ride, Ride.id == Payment.ride_id)
            .filter(
                Ride.driver_id == driver_id,
                Ride.status == "completed",
                Payment.created_at >= start_date,
                Payment.created_at <= end_date,
            )
            .group_by("period")
            .order_by("period")
            .all()
        )

        data = [
            {
                "period": str(int(r.period)),
                "rides": r.rides,
                "earnings": float(r.earnings),
            }
            for r in rows
        ]

    return {
        "start_date": start_date,
        "end_date": end_date,
        "granularity": granularity,
        "currency": "INR",
        "data": data,
    }


# =========================================================
# WRAPPER (STEP 9.6 — PRESERVED BEHAVIOR)
# =========================================================

def get_driver_earnings_last_7_days(db: Session, driver_id: int):
    today = date.today()
    start_date = today - timedelta(days=6)

    return get_driver_earnings_details(
        db=db,
        driver_id=driver_id,
        start_date=start_date,
        end_date=today,
        granularity="daily",
    )
