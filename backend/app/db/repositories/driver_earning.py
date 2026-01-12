from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.models.driver_earning import DriverEarning


def get_driver_earnings(db: Session, driver_id: int):
    return (
        db.query(DriverEarning)
        .filter(DriverEarning.driver_id == driver_id)
        .order_by(DriverEarning.id.desc())
        .all()
    )



def get_driver_total_earnings(db: Session, driver_id: int) -> float:
    total = (
        db.query(func.coalesce(func.sum(DriverEarning.amount), 0))
        .filter(DriverEarning.driver_id == driver_id)
        .scalar()
    )
    return float(total)
