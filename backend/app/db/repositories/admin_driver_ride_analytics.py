# app/db/repositories/admin_driver_ride_analytics.py

from sqlalchemy.orm import Session
from sqlalchemy import func, case, cast, Date

from app.db.models.ride import Ride
from app.db.models.driver import Driver
from app.db.models.driver_earning import DriverEarning


# -------------------------------------------------
# RIDES SUMMARY
# -------------------------------------------------
def get_rides_summary(db: Session):
    total_rides = db.query(func.count(Ride.id)).scalar()

    status_counts = (
        db.query(
            Ride.status,
            func.count(Ride.id).label("count")
        )
        .group_by(Ride.status)
        .all()
    )

    return {
        "total_rides": total_rides,
        "by_status": {
            status: count for status, count in status_counts
        }
    }


# -------------------------------------------------
# DAILY RIDES
# -------------------------------------------------
def get_daily_rides(db: Session):
    results = (
        db.query(
            cast(Ride.created_at, Date).label("date"),
            func.count(Ride.id).label("ride_count")
        )
        .group_by(cast(Ride.created_at, Date))
        .order_by(cast(Ride.created_at, Date).desc())
        .all()
    )

    return [
        {
            "date": row.date,
            "ride_count": row.ride_count
        }
        for row in results
    ]


# -------------------------------------------------
# DRIVERS SUMMARY
# -------------------------------------------------
def get_drivers_summary(db: Session):
    total_drivers = db.query(func.count(Driver.id)).scalar() or 0

    # Online/offline not supported yet
    return {
        "total_drivers": total_drivers,
        "online_drivers": 0,
        "offline_drivers": total_drivers
    }




# -------------------------------------------------
# DRIVER EARNINGS (GROUPED)
# -------------------------------------------------
def get_driver_earnings(db: Session):
    results = (
        db.query(
            DriverEarning.driver_id,
            func.coalesce(func.sum(DriverEarning.amount), 0).label("total_earning")
        )
        .group_by(DriverEarning.driver_id)
        .all()
    )

    return [
        {
            "driver_id": row.driver_id,
            "total_earning": float(row.total_earning)
        }
        for row in results
    ]


# -------------------------------------------------
# PLATFORM EARNINGS
# -------------------------------------------------
def get_platform_earnings(db: Session):
    total_driver_payout = (
        db.query(func.coalesce(func.sum(DriverEarning.amount), 0))
        .scalar()
    )

    total_completed_rides = (
        db.query(func.count(Ride.id))
        .filter(Ride.status == "completed")
        .scalar()
    )

    return {
        "total_driver_payout": float(total_driver_payout),
        "completed_rides": total_completed_rides
    }
