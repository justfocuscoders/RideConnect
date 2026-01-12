from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_driver
from app.schemas.ride import RideOut
from app.services.driver_active_ride import get_driver_active_ride

router = APIRouter(
    prefix="/rides",
    tags=["Drivers"],
)


@router.get("/active", response_model=Optional[RideOut])
def get_active_ride(
    db: Session = Depends(get_db),
    driver=Depends(get_current_driver),
):
    """
    Returns the driver's currently active ride (accepted or in_progress).

    READ-ONLY endpoint.
    """

    return get_driver_active_ride(db, driver_id=driver.id)
