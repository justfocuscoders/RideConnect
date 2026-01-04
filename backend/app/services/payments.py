from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.models.payment import Payment
from app.db.models.driver_earning import DriverEarning

COST_PER_KM = 13
COMMISSION_RATE = 0.20


def create_payment(db: Session, ride):
    # =========================
    # IDMPOTENCY CHECK
    # =========================
    existing_payment = (
        db.query(Payment)
        .filter(Payment.ride_id == ride.id)
        .first()
    )

    if existing_payment:
        return existing_payment

    fare = ride.distance_km * COST_PER_KM
    commission = fare * COMMISSION_RATE
    driver_earning = fare - commission

    try:
        payment = Payment(
            ride_id=ride.id,
            user_id=ride.user_id,
            driver_id=ride.driver_id,
            amount=fare,
            commission=commission,
            driver_earning=driver_earning,
            status="pending",
        )

        db.add(payment)
        db.flush()  # ensure payment.id exists

        earning = DriverEarning(
            driver_id=ride.driver_id,
            payment_id=payment.id,
            amount=driver_earning,
        )

        db.add(earning)
        db.commit()

        return payment

    except IntegrityError:
        db.rollback()
        return (
            db.query(Payment)
            .filter(Payment.ride_id == ride.id)
            .first()
        )
