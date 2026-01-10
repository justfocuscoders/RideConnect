from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.schemas.driver import DriverOut
from app.db.repositories.driver import (
    get_driver_by_user,
    set_driver_online_status,
)

router = APIRouter()


# ==============================
# DRIVER AVAILABILITY
# ==============================

@router.patch("/online", response_model=DriverOut)
def go_online(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(404, "Driver profile not found")

    if not driver.is_verified:
        raise HTTPException(400, "Driver is not verified")

    return set_driver_online_status(db, driver.id, True)


@router.patch("/offline", response_model=DriverOut)
def go_offline(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(404, "Driver profile not found")

    return set_driver_online_status(db, driver.id, False)



