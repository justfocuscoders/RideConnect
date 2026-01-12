from typing import Optional
from sqlalchemy.orm import Session

from app.db.models.ride import Ride

ACTIVE_DRIVER_STATUSES = ("accepted", "in_progress")


def get_driver_active_ride(
    db: Session,
    driver_id: int
) -> Optional[Ride]:
    """
    Returns the driver's currently active ride (accepted or in_progress),
    or None if no active ride exists.

    READ-ONLY:
    - No status updates
    - No validation logic
    - No lifecycle enforcement
    """

    return (
        db.query(Ride)
        .filter(
            Ride.driver_id == driver_id,
            Ride.status.in_(ACTIVE_DRIVER_STATUSES)
        )
        .order_by(Ride.created_at.desc())
        .first()
    )
