from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.api.dependencies import get_current_driver
from app.db.models.ride import Ride
from app.db.models.payment import Payment

router = APIRouter(
    prefix="/dashboard",
    tags=["Driver Dashboard"]
)

# ============================
# DRIVER DASHBOARD OVERVIEW
# ============================
@router.get("/overview")
def driver_dashboard_overview(
    db: Session = Depends(get_db),
    current_driver=Depends(get_current_driver),
):
    total_rides = (
        db.query(Ride)
        .filter(Ride.driver_id == current_driver.id)
        .count()
    )

    completed_rides = (
        db.query(Ride)
        .filter(
            Ride.driver_id == current_driver.id,
            Ride.status == "completed",
        )
        .count()
    )

    active_rides = (
        db.query(Ride)
        .filter(
            Ride.driver_id == current_driver.id,
            Ride.status.in_(["accepted", "arriving", "ongoing"]),
        )
        .count()
    )

    total_earnings = (
        db.query(func.coalesce(func.sum(Payment.amount), 0))
        .filter(Payment.driver_id == current_driver.id)
        .scalar()
    )

    today_earnings = (
        db.query(func.coalesce(func.sum(Payment.amount), 0))
        .filter(
            Payment.driver_id == current_driver.id,
            func.date(Payment.created_at) == func.current_date(),
        )
        .scalar()
    )

    return {
        "total_rides": total_rides,
        "completed_rides": completed_rides,
        "active_rides": active_rides,
        "total_earnings": float(total_earnings),
        "today_earnings": float(today_earnings),
    }


# ============================
# DRIVER ACTIVE RIDE
# ============================
@router.get("/active-ride")
def get_driver_active_ride(
    db: Session = Depends(get_db),
    current_driver=Depends(get_current_driver),
):
    active_statuses = ["accepted", "arriving", "ongoing"]

    ride = (
        db.query(Ride)
        .filter(
            Ride.driver_id == current_driver.id,
            Ride.status.in_(active_statuses),
        )
        .order_by(Ride.created_at.desc())
        .first()
    )

    if not ride:
        return {"has_active_ride": False}

    return {
        "has_active_ride": True,
        "ride": {
            "ride_id": ride.id,
            "status": ride.status,
            "pickup_location": ride.pickup_location,
            "drop_location": ride.drop_location,
            "created_at": ride.created_at,
        },
    }
