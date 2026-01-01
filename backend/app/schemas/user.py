from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool
    created_at: datetime

    profile_complete: bool
    missing_fields: List[str]

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
