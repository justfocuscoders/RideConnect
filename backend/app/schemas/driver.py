from pydantic import BaseModel
from datetime import datetime


class DriverCreate(BaseModel):
    license_number: str
    vehicle_number: str
    vehicle_type: str


class DriverOut(BaseModel):
    id: int
    user_id: int
    license_number: str
    vehicle_number: str
    vehicle_type: str
    is_verified: bool
    is_online: bool
    created_at: datetime

    class Config:
        from_attributes = True
