from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.db.models.ride import Ride
from app.services.payments import create_payment


ALLOWED_STATUS_TRANSITIONS = {
    "requested": ["accepted", "cancelled"],
    "accepted": ["in_progress", "cancelled"],
    "in_progress": ["completed"],
    "completed": [],
    "cancelled": [],
}


def update_ride_status(
    db: Session,
    ride: Ride,
    new_status: str,
) -> Ride:
    allowed_next = ALLOWED_STATUS_TRANSITIONS.get(ride.status, [])

    if new_status not in allowed_next:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition from '{ride.status}' to '{new_status}'",
        )

    ride.status = new_status
    db.add(ride)

    # Atomic completion hook
    if new_status == "completed":
        create_payment(db, ride)

    db.commit()
    db.refresh(ride)

    return ride
