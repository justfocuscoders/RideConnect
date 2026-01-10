from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.core.validators import validate_status_transition
from app.core.ride_status import ALLOWED_STATUS_TRANSITIONS

from app.schemas.ride import (
    RideCreate,
    RideOut,
    RideStatusUpdate,
)

from app.db.repositories.ride import (
    create_ride,
    get_all_rides,
    get_ride_by_id,
    update_ride_status,
)

router = APIRouter(prefix="/rides", tags=["Rides"])


# --------------------------------------------------
# CREATE RIDE
# --------------------------------------------------
@router.post("", response_model=RideOut, status_code=status.HTTP_201_CREATED)
def create_new_ride(
    ride_data: RideCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_ride(db, ride_data, current_user.id)


# --------------------------------------------------
# LIST RIDES
# --------------------------------------------------
@router.get("", response_model=List[RideOut])
def list_rides(db: Session = Depends(get_db)):
    return get_all_rides(db)


# --------------------------------------------------
# READ SINGLE RIDE (OWNERSHIP ENFORCED)
# --------------------------------------------------
@router.get("/{ride_id}", response_model=RideOut)
def read_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    ride = get_ride_by_id(db, ride_id)

    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found",
        )

    if ride.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized",
        )

    return ride


# --------------------------------------------------
# UPDATE RIDE STATUS (OWNERSHIP + TRANSITION RULES)
# --------------------------------------------------
@router.patch("/{ride_id}/status", response_model=RideOut)
def update_ride_status_endpoint(
    ride_id: int,
    status_update: RideStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # 1️⃣ Fetch ride
    ride = get_ride_by_id(db, ride_id)
    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found",
        )

    # 2️⃣ Ownership authorization (STEP 3.2.1)
    if ride.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this ride",
        )

    # 3️⃣ Status transition validation (STEP 3.2.2) ✅ FIXED
    validate_status_transition(
        ride.status,
        status_update.status.value
    )

    # 4️⃣ Persist update (repository unchanged) ✅ FIXED
    updated_ride = update_ride_status(
    db,
    ride.id,
    status_update.status.value
)


    return updated_ride


# --------------------------------------------------
# Cancel
# --------------------------------------------------

@router.patch("/{ride_id}/cancel")
def cancel_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    # 1. Ride exists
    ride = get_ride_by_id(db, ride_id)
    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found",
        )

    # 2. Ownership check
    if ride.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to cancel this ride",
        )

    # 3. Terminal state protection
    if ride.status in ("completed", "cancelled"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ride is already {ride.status} and cannot be cancelled",
        )

    # 4. Transition validation
    if "cancelled" not in ALLOWED_STATUS_TRANSITIONS.get(ride.status, set()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ride cannot be cancelled when status is '{ride.status}'",
        )

    # 5. Update (✅ FIXED LINE)
    updated_ride = update_ride_status(db, ride.id, "cancelled")

    return {
        "id": updated_ride.id,
        "status": updated_ride.status,
    }