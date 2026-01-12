from typing import List
from sqlalchemy.orm import Session

from app.db.models.ride import Ride
from app.schemas.ride import RideCreate
from app.services.payments import create_payment

# Locked pricing rule
COST_PER_KM = 13


# =========================
# CREATE RIDE (PASSENGER)
# =========================
def create_ride(db: Session, ride_data: RideCreate, user_id: int) -> Ride:
    """
    Creates a new ride request.
    Fare is calculated automatically based on distance.
    """

    estimated_fare = int(ride_data.distance_km * COST_PER_KM)

    ride = Ride(
        pickup_location=ride_data.pickup_location,
        drop_location=ride_data.drop_location,
        distance_km=ride_data.distance_km,
        estimated_fare=estimated_fare,
        status="requested",
        user_id=user_id
    )

    db.add(ride)
    db.commit()
    db.refresh(ride)
    return ride


# =========================
# READ RIDES
# =========================
def get_all_rides(db: Session) -> List[Ride]:
    return (
        db.query(Ride)
        .order_by(Ride.created_at.desc())
        .all()
    )


def get_ride_by_id(db: Session, ride_id: int):
    return db.query(Ride).filter(Ride.id == ride_id).first()


# =========================
# DRIVER ACTIONS
# =========================
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


def start_ride_as_driver(db: Session, ride_id: int, driver_id: int):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()

    if not ride:
        return None, "Ride not found"

    if ride.driver_id != driver_id:
        return None, "Not authorized for this ride"

    if ride.status != "accepted":
        return None, "Ride cannot be started"

    ride.status = "ongoing"

    db.commit()
    db.refresh(ride)
    return ride, None


def complete_ride_as_driver(db: Session, ride_id: int, driver_id: int):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()

    if not ride:
        return None, "Ride not found"

    if ride.driver_id != driver_id:
        return None, "Not authorized for this ride"

    if ride.status != "ongoing":
        return None, "Ride cannot be completed"

    try:
        # Atomic operation starts
        ride.status = "completed"
        db.flush()  # DO NOT commit yet

        create_payment(db, ride)

        db.commit()
        db.refresh(ride)
        return ride, None

    except Exception:
        db.rollback()
        return None, "Failed to complete ride safely"


# =========================
# ADMIN / SYSTEM
# =========================
def update_ride_status(db: Session, ride_id: int, status: str):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()

    if not ride:
        return None

    ride.status = status
    db.commit()
    db.refresh(ride)
    return ride
