from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.api.dependencies import get_current_user

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
    current_user = Depends(get_current_user),
):
    return create_ride(db, ride_data, current_user.id)


# --------------------------------------------------
# LIST RIDES (unchanged for now)
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
    current_user = Depends(get_current_user),
):
    ride = get_ride_by_id(db, ride_id)

    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found",
        )

    # ✅ Ownership check
    if ride.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized",
        )

    return ride


# --------------------------------------------------
# UPDATE RIDE STATUS (OWNERSHIP ENFORCED)
# --------------------------------------------------
@router.patch("/{ride_id}/status", response_model=RideOut)
def update_status(
    ride_id: int,
    payload: RideStatusUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    ride = get_ride_by_id(db, ride_id)

    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found",
        )

    # ✅ Ownership check
    if ride.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized",
        )

    # ❗ Status transition rules will be added in STEP 3.2.2
    ride = update_ride_status(db, ride_id, payload.status)

    return ride
