from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.repositories.user import create_user, get_user_by_email
from app.db.repositories.driver import get_driver_by_user
from app.schemas.user import UserCreate
from app.schemas.auth import LoginRequest
from app.core.security import verify_password, create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# =====================================================
# REGISTER USER (FIXED)
# =====================================================
@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED
)
def register_user(
    payload: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = get_user_by_email(db, payload.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user = create_user(db, payload)

    # ✅ Return SIMPLE response (no response_model)
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "phone": user.phone,
        "role": user.role,
    }


# =====================================================
# LOGIN USER (UNCHANGED)
# =====================================================
@router.post("/login")
def login_user(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, login_data.email)

    if not user or not verify_password(
        login_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # ============================
    # JWT PAYLOAD
    # ============================
    token_payload = {
        "sub": user.email,
        "role": user.role,
    }

    if user.role == "driver":
        driver = get_driver_by_user(db, user.id)
        if not driver:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Driver profile not found"
            )
        token_payload["driver_id"] = driver.id

    access_token = create_access_token(data=token_payload)

    # ============================
    # PROFILE COMPLETION CHECK
    # ============================
    missing_fields = []
    if not user.name:
        missing_fields.append("name")
    if not user.phone:
        missing_fields.append("phone")

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "phone": user.phone,
            "role": user.role,
            "profile_complete": len(missing_fields) == 0,
            "missing_fields": missing_fields,
        }
    }
