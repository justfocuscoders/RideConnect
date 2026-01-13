from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.db.repositories.driver import get_driver_by_user
from app.db.models.ride import Ride
from app.schemas.ride import RideOut
from app.websockets.manager import manager
import asyncio

router = APIRouter(prefix="/drivers/rides", tags=["Driver Rides"])


# =========================
# AVAILABLE RIDES
# =========================
@router.get("/available", response_model=list[RideOut])
def get_available_rides(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(403, "Driver profile not found")

    return (
        db.query(Ride)
        .filter(Ride.status == "requested", Ride.driver_id == None)
        .order_by(Ride.created_at.desc())
        .all()
    )


# =========================
# ACCEPT RIDE
# =========================
@router.patch("/{ride_id}/accept", response_model=RideOut)
def accept_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(403, "Driver profile not found")

    ride = (
        db.query(Ride)
        .filter(Ride.id == ride_id, Ride.status == "requested")
        .first()
    )

    if not ride:
        raise HTTPException(400, "Ride already taken")

    ride.driver_id = driver.id
    ride.status = "accepted"
    db.commit()
    db.refresh(ride)

    # 🔔 REALTIME → REMOVE FROM OTHER DRIVERS
    asyncio.create_task(
        manager.broadcast_to_role(
            {
                "event": "ride_accepted",
                "data": {
                    "ride_id": ride.id,
                    "driver_id": driver.id,
                },
            },
            role="driver",
        )
    )

    return ride
