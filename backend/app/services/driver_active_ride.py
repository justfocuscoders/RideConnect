from typing import Optional
from sqlalchemy.orm import Session
from app.db.models.ride import Ride

ACTIVE_DRIVER_STATUSES = ("accepted", "ongoing")

def get_driver_active_ride(
    db: Session,
    driver_id: int
) -> Optional[Ride]:
    return (
        db.query(Ride)
        .filter(
            Ride.driver_id == driver_id,
            Ride.status.in_(ACTIVE_DRIVER_STATUSES)
        )
        .order_by(Ride.created_at.desc())
        .first()
    )
