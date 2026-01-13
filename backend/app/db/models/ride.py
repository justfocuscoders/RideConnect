from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.db.base import Base


class Ride(Base):
    __tablename__ = "rides"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    driver_id = Column(
        Integer,
        ForeignKey("drivers.id", ondelete="SET NULL"),
        nullable=True
    )

    pickup_location = Column(String(255), nullable=False)
    drop_location = Column(String(255), nullable=False)

    distance_km = Column(Float, nullable=False)

    # ✅ REQUIRED — THIS FIXES THE CRASH
    estimated_fare = Column(Float, nullable=False)

    # ✅ REQUIRED — prevents insert failures
    status = Column(String(50), nullable=False, default="requested")

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    driver = relationship("Driver", backref="rides")
