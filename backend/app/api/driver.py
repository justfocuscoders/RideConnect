from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.dependencies import get_current_user

from app.schemas.driver import DriverCreate, DriverOut
from app.schemas.ride import RideOut

from app.db.repositories.driver import (
    create_driver,
    get_driver_by_user,
    set_driver_availability,
)

from app.db.repositories.ride import (
    accept_ride_as_driver,
    start_ride_as_driver,
    complete_ride_as_driver,
)

router = APIRouter(prefix="/drivers", tags=["Drivers"])


@router.post("", response_model=DriverOut, status_code=status.HTTP_201_CREATED)
def register_driver(
    data: DriverCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing = get_driver_by_user(db, current_user.id)
    if existing:
        raise HTTPException(400, "Driver profile already exists")

    return create_driver(db, current_user.id, data)


@router.get("/me", response_model=DriverOut)
def get_my_driver_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(404, "Driver profile not found")
    return driver


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

    return set_driver_availability(db, driver.id, True)


@router.patch("/offline", response_model=DriverOut)
def go_offline(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(404, "Driver profile not found")

    return set_driver_availability(db, driver.id, False)


@router.patch("/rides/{ride_id}/accept", response_model=RideOut)
def accept_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(404, "Driver profile not found")

    if not driver.is_available:
        raise HTTPException(400, "Driver is offline")

    ride, error = accept_ride_as_driver(db, ride_id, driver.id)
    if error:
        raise HTTPException(400, error)

    return RideOut.model_validate(ride)


@router.patch("/rides/{ride_id}/start", response_model=RideOut)
def start_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(404, "Driver profile not found")

    ride, error = start_ride_as_driver(db, ride_id, driver.id)
    if error:
        raise HTTPException(400, error)

    return RideOut.model_validate(ride)


@router.patch("/rides/{ride_id}/complete", response_model=RideOut)
def complete_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(404, "Driver profile not found")

    ride, error = complete_ride_as_driver(db, ride_id, driver.id)
    if error:
        raise HTTPException(400, error)

    return RideOut.model_validate(ride)
