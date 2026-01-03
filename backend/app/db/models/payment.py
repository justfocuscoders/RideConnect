from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    ride_id = Column(
        Integer,
        ForeignKey("rides.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    driver_id = Column(
        Integer,
        ForeignKey("drivers.id"),
        nullable=False
    )

    amount = Column(Float, nullable=False)          # total fare
    commission = Column(Float, nullable=False)      # platform cut
    driver_earning = Column(Float, nullable=False)  # driver income

    status = Column(String(20), default="pending", nullable=False)

    ride = relationship("Ride")
    driver = relationship("Driver")
