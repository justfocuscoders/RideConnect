from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.api.dependencies import get_current_driver
from app.db.models.ride import Ride
from app.db.models.payment import Payment

router = APIRouter(prefix="/dashboard", tags=["Driver Dashboard"])

@router.get("/overview")
def driver_dashboard_overview(
    db: Session = Depends(get_db),
    current_driver = Depends(get_current_driver)
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

    total_earnings = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(
        Payment.driver_id == current_driver.id,
        Payment.status == "PAID"
    ).scalar()

    today_earnings = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(
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
