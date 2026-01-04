from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict


class RideCreate(BaseModel):
    pickup_location: str
    drop_location: str
    distance_km: float


class RideOut(BaseModel):
    id: int
    user_id: int
    driver_id: Optional[int] = None
    pickup_location: str
    drop_location: str
    status: str
    estimated_fare: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RideStatus(str, Enum):
    requested = "requested"
    accepted = "accepted"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"


class RideStatusUpdate(BaseModel):
    status: RideStatus
