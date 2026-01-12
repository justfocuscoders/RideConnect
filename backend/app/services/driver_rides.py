from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.db.models.ride import Ride


def start_ride(db: Session, ride_id: int, driver_id: int):
    ride = (
        db.query(Ride)
        .filter(
            Ride.id == ride_id,
            Ride.driver_id == driver_id
        )
        .first()
    )

    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found"
        )

    if ride.status != "accepted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ride cannot be started in current state"
        )

    ride.status = "ongoing"
    db.commit()
    db.refresh(ride)
    return ride


def complete_ride(db: Session, ride_id: int, driver_id: int):
    ride = (
        db.query(Ride)
        .filter(
            Ride.id == ride_id,
            Ride.driver_id == driver_id
        )
        .first()
    )

    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found"
        )

    if ride.status != "ongoing":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ride cannot be completed in current state"
        )

    ride.status = "completed"
    db.commit()
    db.refresh(ride)
    return ride
