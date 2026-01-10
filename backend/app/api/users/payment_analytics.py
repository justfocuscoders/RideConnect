from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from app.db.session import get_db
from app.api.dependencies import get_current_user

from app.db.repositories.payment_analytics import (
    get_payment_summary,
    get_payment_rides,
)

from app.schemas.payment_analytics import (
    PaymentSummaryOut,
    PaymentRideOut,
)

router = APIRouter(
    prefix="/payments/me",
    tags=["Payment Analytics"]
)


# =========================
# USER PAYMENT SUMMARY
# =========================
@router.get("/summary", response_model=PaymentSummaryOut)
def payment_summary(
    from_date: date = Query(..., alias="from"),
    to_date: date = Query(..., alias="to"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_payment_summary(
        db=db,
        user_id=current_user.id,
        from_date=from_date,
        to_date=to_date,
    )


# =========================
# USER PAYMENT RIDES
# =========================
@router.get("/rides", response_model=List[PaymentRideOut])
def payment_rides(
    from_date: date = Query(..., alias="from"),
    to_date: date = Query(..., alias="to"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_payment_rides(
        db=db,
        user_id=current_user.id,
        from_date=from_date,
        to_date=to_date,
    )
