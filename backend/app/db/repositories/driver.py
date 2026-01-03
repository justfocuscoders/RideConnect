from sqlalchemy.orm import Session
from app.db.models.driver import Driver
from app.schemas.driver import DriverCreate


def create_driver(db: Session, user_id: int, data: DriverCreate) -> Driver:
    driver = Driver(
        user_id=user_id,
        license_number=data.license_number,
        vehicle_number=data.vehicle_number,
        vehicle_type=data.vehicle_type,
    )
    db.add(driver)
    db.commit()
    db.refresh(driver)
    return driver


def get_driver_by_user(db: Session, user_id: int):
    return (
        db.query(Driver)
        .filter(Driver.user_id == user_id)
        .first()
    )


def set_driver_availability(db: Session, driver_id: int, available: bool):
    driver = (
        db.query(Driver)
        .filter(Driver.id == driver_id)
        .first()
    )

    if not driver:
        return None

    driver.is_available = available
    db.commit()
    db.refresh(driver)
    return driver
