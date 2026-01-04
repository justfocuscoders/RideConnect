from sqlalchemy.orm import Session
from app.db.models.payment import Payment


def get_payments_for_user(db: Session, user_id: int):
    return (
        db.query(Payment)
        .filter(Payment.user_id == user_id)
        .order_by(Payment.created_at.desc())
        .all()
    )


def get_payment_by_id(db: Session, payment_id: int):
    return db.query(Payment).filter(Payment.id == payment_id).first()


def mark_payment_paid(db: Session, payment: Payment):
    if payment.status == "paid":
        return payment

    payment.status = "paid"
    db.commit()
    db.refresh(payment)
    return payment
