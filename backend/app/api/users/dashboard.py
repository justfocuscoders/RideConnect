from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user_dashboard import (
    UserDashboardSummary,
    UserRideItem,
    UserPaymentItem,
)
from app.db.repositories.user_dashboard import (
    get_user_dashboard_summary,
    get_user_rides,
    get_user_payments,
    get_user_active_ride,   # ✅ NEW
)
from app.api.dependencies import get_current_user
from app.db.models.user import User

router = APIRouter(
    prefix="/users/dashboard",
    tags=["User Dashboard"],
)

# =========================
# DASHBOARD SUMMARY
# =========================
@router.get("/summary", response_model=UserDashboardSummary)
def user_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_dashboard_summary(db, current_user.id)


# =========================
# USER RIDES
# =========================
@router.get("/rides", response_model=list[UserRideItem])
def user_dashboard_rides(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_rides(db, current_user.id)


# =========================
# USER PAYMENTS
# =========================
@router.get("/payments", response_model=list[UserPaymentItem])
def user_dashboard_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_payments(db, current_user.id)


# =========================
# ACTIVE RIDE (STEP 9.9)
# =========================
@router.get("/active-ride")
def user_active_ride(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns the currently active ride for the user, if any.
    Active statuses:
    REQUESTED, ACCEPTED, ARRIVING, ONGOING
    """
    return get_user_active_ride(db, current_user.id)
