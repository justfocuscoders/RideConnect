from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.models.user import User
from app.db.models.driver import Driver
from app.schemas.user import UserOut, UserUpdate
from app.db.repositories.user import update_user
from app.db.session import get_db

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut)
def read_current_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    missing = []

    if not current_user.name:
        missing.append("name")
    if not current_user.phone:
        missing.append("phone")

    # 🔹 Resolve driver status from drivers table
    driver_status = None
    if current_user.role == "driver":
        driver = (
            db.query(Driver)
            .filter(Driver.user_id == current_user.id)
            .first()
        )
        driver_status = "verified" if driver and driver.is_verified else "pending"

    return UserOut(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        phone=current_user.phone,
        role=current_user.role,              # ✅ ADD
        driver_status=driver_status,          # ✅ ADD
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        profile_complete=len(missing) == 0,
        missing_fields=missing,
    )


@router.put("/me", response_model=UserOut)
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated_user = update_user(
        db,
        current_user,
        payload.dict(exclude_unset=True),
    )

    missing = []
    if not updated_user.name:
        missing.append("name")
    if not updated_user.phone:
        missing.append("phone")

    # 🔹 Resolve driver status again (safe & consistent)
    driver_status = None
    if updated_user.role == "driver":
        driver = (
            db.query(Driver)
            .filter(Driver.user_id == updated_user.id)
            .first()
        )
        driver_status = "verified" if driver and driver.is_verified else "pending"

    return UserOut(
        id=updated_user.id,
        email=updated_user.email,
        name=updated_user.name,
        phone=updated_user.phone,
        role=updated_user.role,               # ✅ ADD
        driver_status=driver_status,           # ✅ ADD
        is_active=updated_user.is_active,
        created_at=updated_user.created_at,
        profile_complete=len(missing) == 0,
        missing_fields=missing,
    )
