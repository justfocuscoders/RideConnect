from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.schemas.ride import RideCreate, RideOut
from app.db.repositories.ride import create_ride, get_all_rides

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
