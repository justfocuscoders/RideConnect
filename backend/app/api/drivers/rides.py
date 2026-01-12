from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.db.repositories.driver import get_driver_by_user
from app.db.repositories.ride import (
    accept_ride_as_driver,
    start_ride_as_driver,
    complete_ride_as_driver,
)
from app.db.models.ride import Ride
from app.schemas.ride import RideOut
from app.api.utils.ride_response import build_ride_out

router = APIRouter(tags=["Driver Rides"])

# ==========================
# GET DRIVER RIDES
# ==========================
@router.get("/rides", response_model=list[RideOut])
def get_driver_rides(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(403, "Driver profile not found")

    rides = (
        db.query(Ride)
        .filter(Ride.driver_id == driver.id)
        .order_by(Ride.created_at.desc())
        .all()
    )

    return [build_ride_out(r) for r in rides]

# ==========================
# DRIVER ACTIONS
# ==========================
@router.patch("/rides/{ride_id}/accept", response_model=RideOut)
def accept_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(403, "Driver profile not found")

    ride, error = accept_ride_as_driver(db, ride_id, driver.id)
    if error:
        raise HTTPException(400, error)

    return build_ride_out(ride)

@router.patch("/rides/{ride_id}/start", response_model=RideOut)
def start_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(403, "Driver profile not found")

    ride, error = start_ride_as_driver(db, ride_id, driver.id)
    if error:
        raise HTTPException(400, error)

    return build_ride_out(ride)

@router.patch("/rides/{ride_id}/complete", response_model=RideOut)
def complete_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(403, "Driver profile not found")

    ride, error = complete_ride_as_driver(db, ride_id, driver.id)
    if error:
        raise HTTPException(400, error)

    return build_ride_out(ride)
