from fastapi import HTTPException, status
from app.core.ride_status import ALLOWED_STATUS_TRANSITIONS


def validate_status_transition(current_status: str, new_status: str):
    allowed = ALLOWED_STATUS_TRANSITIONS.get(current_status, [])

    if new_status not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition: {current_status} → {new_status}",
        )
