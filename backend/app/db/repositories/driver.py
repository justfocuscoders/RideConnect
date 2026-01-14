from sqlalchemy.orm import Session

from app.db.models.driver import Driver
from app.db.models.user import User
from app.schemas.driver import DriverCreate


def create_driver(db: Session, user_id: int, data: DriverCreate) -> Driver:
    """
    Create driver profile and upgrade user role to 'driver'
    """

    # ============================
    # CREATE DRIVER PROFILE
    # ============================
    driver = Driver(
        user_id=user_id,
        license_number=data.license_number,
        vehicle_number=data.vehicle_number,
        vehicle_type=data.vehicle_type,
    )
    db.add(driver)

    # ============================
    # 🔑 CRITICAL FIX: UPDATE USER ROLE
    # ============================
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise ValueError("User not found while creating driver")

    user.role = "driver"
    db.add(user)

    # ============================
    # COMMIT TRANSACTION
    # ============================
    db.commit()
    db.refresh(driver)

    return driver


def get_driver_by_user(db: Session, user_id: int):
    return (
        db.query(Driver)
        .filter(Driver.user_id == user_id)
        .first()
    )


def set_driver_online_status(db: Session, driver_id: int, is_online: bool):
    driver = (
        db.query(Driver)
        .filter(Driver.id == driver_id)
        .first()
    )

    if not driver:
        return None

    driver.is_online = is_online
    db.commit()
    db.refresh(driver)
    return driver
