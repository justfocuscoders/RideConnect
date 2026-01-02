from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.schemas.ride import RideCreate, RideOut
from app.db.repositories.ride import create_ride, get_all_rides

from fastapi import HTTPException, status
from app.db.repositories.ride import get_ride_by_id
from app.schemas.ride import RideOut

router = APIRouter(prefix="/rides", tags=["Rides"])


@router.post("", response_model=RideOut, status_code=status.HTTP_201_CREATED)
def create_new_ride(
    ride_data: RideCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return create_ride(db, ride_data, current_user.id)


@router.get("", response_model=List[RideOut])
def list_rides(db: Session = Depends(get_db)):
    return get_all_rides(db)


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

    # Optional authorization guard (enable if required)
    # if ride.user_id != current_user.id:
    #     raise HTTPException(status_code=403, detail="Not authorized")

    return ride