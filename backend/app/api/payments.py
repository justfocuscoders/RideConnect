from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api.utils.payment_response import build_payment_out

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.schemas.payment import PaymentOut, PaymentMarkPaid
from app.db.repositories.payment import (
    get_payments_for_user,
    get_payment_by_id,
    mark_payment_paid,
)

router = APIRouter(prefix="/payments", tags=["Payments"])


# =========================
# PASSENGER: VIEW PAYMENTS
# =========================
@router.get("/me", response_model=list[PaymentOut])
def get_my_payments(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    payments = get_payments_by_user(db, current_user.id)
    return [build_payment_out(p) for p in payments]

# =========================
# ADMIN / SYSTEM: MARK PAID
# =========================
@router.patch("/{payment_id}/mark-paid", response_model=PaymentOut)
def mark_payment_as_paid(
    payment_id: int,
    payload: PaymentMarkPaid,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # NOTE: In future, restrict this to admin role
    if payload.status != "paid":
        raise HTTPException(status_code=400, detail="Invalid status")

    payment = get_payment_by_id(db, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    return mark_payment_paid(db, payment)
