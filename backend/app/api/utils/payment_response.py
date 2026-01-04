from app.schemas.payment import PaymentOut

COMMISSION_RATE = 0.20


def build_payment_out(payment):
    commission = int(payment.amount * COMMISSION_RATE)
    driver_earning = payment.amount - commission

    return PaymentOut(
        id=payment.id,
        ride_id=payment.ride_id,
        amount=payment.amount,
        commission=commission,
        driver_earning=driver_earning,
        status=payment.status,
        created_at=payment.created_at,
    )
