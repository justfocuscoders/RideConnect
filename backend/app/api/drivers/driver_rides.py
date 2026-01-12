from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models.ride import Ride
from app.api.dependencies import get_current_driver
from app.core.ride_status import update_ride_status

router = APIRouter(prefix="/drivers/rides", tags=["Driver Rides"])

def get_driver_ride_or_404(
    ride_id: int,
    driver_id: int,
    db: Session
) -> Ride:
    ride = db.query(Ride).filter(Ride.id == ride_id).first()

    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found"
        )

    if ride.driver_id != driver_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this ride"
        )

    return ride

@router.patch("/{ride_id}/accept")
def accept_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    driver = Depends(get_current_driver),
):
    ride = get_driver_ride_or_404(ride_id, driver.id, db)

    return update_ride_status(
        db=db,
        ride=ride,
        new_status="accepted"
    )

@router.patch("/{ride_id}/start")
def start_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    driver = Depends(get_current_driver),
):
    ride = get_driver_ride_or_404(ride_id, driver.id, db)

    return update_ride_status(
        db=db,
        ride=ride,
        new_status="in_progress"
    )

@router.patch("/{ride_id}/complete")
def complete_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    driver = Depends(get_current_driver),
):
    ride = get_driver_ride_or_404(ride_id, driver.id, db)

    return update_ride_status(
        db=db,
        ride=ride,
        new_status="completed"
    )
