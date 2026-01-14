from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.schemas.driver import DriverCreate, DriverOut
from app.db.repositories.driver import create_driver, get_driver_by_user

router = APIRouter(
    prefix="/profile",
    tags=["Drivers"],
)

# ==============================
# REGISTER DRIVER
# ==============================
@router.post(
    "",
    response_model=DriverOut,
    status_code=status.HTTP_201_CREATED
)
def register_driver(
    data: DriverCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing = get_driver_by_user(db, current_user.id)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Driver profile already exists"
        )

    return create_driver(db, current_user.id, data)


# ==============================
# GET MY DRIVER PROFILE
# ==============================
@router.get(
    "/me",
    response_model=DriverOut
)
def get_my_driver_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = get_driver_by_user(db, current_user.id)
    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver profile not found"
        )

    return driver
