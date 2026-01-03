from sqlalchemy.orm import Session
from typing import List

from app.db.models.ride import Ride
from app.schemas.ride import RideCreate


def create_ride(db: Session, ride_data: RideCreate, user_id: int) -> Ride:
    ride = Ride(
        pickup_location=ride_data.pickup_location,
        drop_location=ride_data.drop_location,
        estimated_fare=ride_data.estimated_fare,
        status="requested",   # 👈 ADD THIS
        user_id=user_id
    )

    db.add(ride)
    db.commit()
    db.refresh(ride)
    return ride



def get_all_rides(db: Session) -> List[Ride]:
    return (
        db.query(Ride)
        .order_by(Ride.created_at.desc())
        .all()
    )

def get_ride_by_id(db: Session, ride_id: int):
    return db.query(Ride).filter(Ride.id == ride_id).first()


def update_ride_status(db: Session, ride_id: int, status: str):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        return None

    ride.status = status
    db.commit()
    db.refresh(ride)
    return ride

def start_ride_as_driver(db: Session, ride_id: int, driver_id: int):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        return None, "Ride not found"

    if ride.driver_id != driver_id:
        return None, "Not authorized for this ride"

    if ride.status != "accepted":
        return None, "Ride cannot be started"

    ride.status = "in_progress"
    db.commit()
    db.refresh(ride)
    return ride, None


def complete_ride_as_driver(db: Session, ride_id: int, driver_id: int):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        return None, "Ride not found"

    if ride.driver_id != driver_id:
        return None, "Not authorized for this ride"

    if ride.status != "in_progress":
        return None, "Ride cannot be completed"

    ride.status = "completed"
    db.commit()
    db.refresh(ride)
    return ride, None

def accept_ride_as_driver(db: Session, ride_id: int, driver_id: int):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        return None, "Ride not found"

    if ride.status != "requested":
        return None, "Ride cannot be accepted"

    if ride.driver_id is not None:
        return None, "Ride already assigned"

    ride.driver_id = driver_id
    ride.status = "accepted"
    db.commit()
    db.refresh(ride)
    return ride, None
