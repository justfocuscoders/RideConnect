from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class Ride(Base):
    __tablename__ = "rides"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    pickup_location = Column(String, nullable=False)
    drop_location = Column(String, nullable=False)

    status = Column(String, default="requested")
    
    estimated_fare = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
