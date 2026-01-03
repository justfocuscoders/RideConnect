from sqlalchemy import Column, Integer, Float, ForeignKey
from app.db.base import Base


class DriverEarning(Base):
    __tablename__ = "driver_earnings"

    id = Column(Integer, primary_key=True, index=True)

    driver_id = Column(
        Integer,
        ForeignKey("drivers.id"),
        nullable=False,
        index=True
    )

    payment_id = Column(
        Integer,
        ForeignKey("payments.id"),
        nullable=False,
        unique=True
    )

    amount = Column(Float, nullable=False)
