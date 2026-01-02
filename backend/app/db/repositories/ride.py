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
