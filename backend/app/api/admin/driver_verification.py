from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.dependencies import get_current_admin
from app.db.models.driver import Driver
from app.db.models.user import User

router = APIRouter(
    prefix="/drivers",
    tags=["Admin – Drivers"],
    dependencies=[Depends(get_current_admin)],
)

# -------------------------------------------------
# LIST ALL DRIVERS
# -------------------------------------------------
@router.get("")
def list_drivers(db: Session = Depends(get_db)):
    drivers = (
        db.query(
            Driver.id,
            Driver.is_verified,
            Driver.is_online,
            User.email,
            User.name,
        )
        .join(User, User.id == Driver.user_id)
        .order_by(Driver.id.desc())
        .all()
    )

    return [
        {
            "driver_id": d.id,
            "name": d.name,
            "email": d.email,
            "is_verified": d.is_verified,
            "is_online": d.is_online,
        }
        for d in drivers
    ]


# -------------------------------------------------
# VERIFY DRIVER
# -------------------------------------------------
@router.patch("/{driver_id}/verify")
def verify_driver(
    driver_id: int,
    db: Session = Depends(get_db),
):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    if driver.is_verified:
        raise HTTPException(
            status_code=409,
            detail="Driver already verified"
        )

    driver.is_verified = True
    driver.is_online = False  # safety
    db.commit()

    return {
        "message": "Driver verified successfully",
        "driver_id": driver.id,
        "is_verified": driver.is_verified,
    }
