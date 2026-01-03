COST_PER_KM = 13
COMMISSION_RATE = 0.20

def create_payment(db, ride):
    fare = ride.distance_km * COST_PER_KM
    commission = fare * COMMISSION_RATE
    driver_earning = fare - commission

    payment = Payment(
        ride_id=ride.id,
        user_id=ride.user_id,
        driver_id=ride.driver_id,
        amount=fare,
        commission=commission,
        driver_earning=driver_earning,
        status="pending"
    )

    db.add(payment)
    db.flush()

    db.add(
        DriverEarning(
            driver_id=ride.driver_id,
            payment_id=payment.id,
            amount=driver_earning
        )
    )

    db.commit()
