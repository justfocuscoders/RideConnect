from pydantic import BaseModel
from datetime import datetime


class RideCreate(BaseModel):
    pickup_location: str
    drop_location: str
    estimated_fare: int = 0

class RideOut(BaseModel):
    id: int
    user_id: int
    pickup_location: str
    drop_location: str
    status: str
    estimated_fare: int
    created_at: datetime

    class Config:
        from_attributes = True
