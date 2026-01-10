from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.api.dependencies import get_current_user, get_current_driver

from app.schemas.driver import DriverCreate, DriverOut
from app.schemas.ride import RideOut
from app.api.utils.ride_response import build_ride_out
# Import sub-routers
from .dashboard import router as dashboard_router
from .earnings import router as earnings_router

from app.db.repositories.driver import (
    create_driver,
    get_driver_by_user,
    set_driver_availability,
)

from app.db.repositories.ride import (
    accept_ride_as_driver,
    start_ride_as_driver,
    complete_ride_as_driver,
)

from app.db.models.ride import Ride
from app.db.models.payment import Payment

# ✅ SINGLE ROUTER (IMPORTANT)
router = APIRouter(prefix="/drivers", tags=["Drivers"])


router.include_router(dashboard_router)
router.include_router(earnings_router)


# ==============================
# DRIVER DASHBOARD OVERVIEW
# ==============================

@router.get("/dashboard/overview", tags=["Driver Dashboard"])
def driver_dashboard_overview(
    db: Session = Depends(get_db),
    current_driver=Depends(get_current_driver),
):
    total_rides = db.query(Ride).filter(
        Ride.driver_id == current_driver.id
    ).count()

    completed_rides = db.query(Ride).filter(
        Ride.driver_id == current_driver.id,
        Ride.status == "COMPLETED"
    ).count()

    active_rides = db.query(Ride).filter(
        Ride.driver_id == current_driver.id,
        Ride.status.in_(["ASSIGNED", "ACCEPTED", "STARTED"])
    ).count()

    total_earnings = db.query(
        func.coalesce(func.sum(Payment.amount), 0)
    ).filter(
        Payment.driver_id == current_driver.id,
        Payment.status == "PAID"
    ).scalar()

    today_earnings = db.query(
        func.coalesce(func.sum(Payment.amount), 0)
    ).filter(
        Payment.driver_id == current_driver.id,
        Payment.status == "PAID",
        func.date(Payment.created_at) == func.current_date()
    ).scalar()

    return {
        "total_rides": total_rides,
        "completed_rides": completed_rides,
        "active_rides": active_rides,
        "total_earnings": float(total_earnings),
        "today_earnings": float(today_earnings),
    }
