from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Index
from sqlalchemy.orm import relationship
from app.db.base import Base


class Ride(Base):
    __tablename__ = "rides"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    driver_id = Column(
        Integer,
        ForeignKey("drivers.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    pickup_location = Column(String(255), nullable=False)
    drop_location = Column(String(255), nullable=False)

    distance_km = Column(Float, nullable=False)

    # REQUIRED — prevents insert crashes
    estimated_fare = Column(Float, nullable=False)

    # Ride lifecycle state
    status = Column(
        String(30),
        nullable=False,
        default="requested",
        index=True
    )
    # requested | accepted | ongoing | completed | cancelled

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        index=True
    )

    # Relationships
    user = relationship("User", backref="rides")
    driver = relationship("Driver", backref="rides")

    # Performance index for driver discovery
    __table_args__ = (
        Index("idx_available_rides", "status", "driver_id"),
    )
