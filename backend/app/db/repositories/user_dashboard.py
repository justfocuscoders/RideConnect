from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.models.ride import Ride
from app.db.models.payment import Payment


# =========================
# DASHBOARD SUMMARY
# =========================
def get_user_dashboard_summary(db: Session, user_id: int):
    total_rides = (
        db.query(func.count(Ride.id))
        .filter(Ride.user_id == user_id)
        .scalar()
        or 0
    )

    completed_rides = (
        db.query(func.count(Ride.id))
        .filter(
            Ride.user_id == user_id,
            Ride.status == "completed",
        )
        .scalar()
        or 0
    )

    cancelled_rides = (
        db.query(func.count(Ride.id))
        .filter(
            Ride.user_id == user_id,
            Ride.status == "cancelled",
        )
        .scalar()
        or 0
    )

    total_spent = (
        db.query(func.coalesce(func.sum(Payment.amount), 0))
        .filter(Payment.user_id == user_id)
        .scalar()
    )

    return {
        "total_rides": total_rides,
        "completed_rides": completed_rides,
        "cancelled_rides": cancelled_rides,
        "total_spent": float(total_spent),
    }


# =========================
# USER RIDES
# =========================
def get_user_rides(db: Session, user_id: int):
    return (
        db.query(Ride)
        .filter(Ride.user_id == user_id)
        .order_by(Ride.created_at.desc())
        .limit(10)
        .all()
    )


# =========================
# USER PAYMENTS
# =========================
def get_user_payments(db: Session, user_id: int):
    return (
        db.query(Payment)
        .filter(Payment.user_id == user_id)
        .order_by(Payment.created_at.desc())
        .limit(10)
        .all()
    )


# =========================
# ACTIVE RIDE (STEP 9.9) — FINAL FIXED
# =========================
def get_user_active_ride(db: Session, user_id: int):
    """
    Returns the most recent active ride for the user.
    Active statuses:
    requested, accepted, arriving, ongoing
    """

    active_ride = (
        db.query(Ride)
        .filter(
            Ride.user_id == user_id,
            Ride.status.in_(["requested", "accepted", "arriving", "ongoing"]),
        )
        .order_by(Ride.created_at.desc())
        .first()
    )

    if not active_ride:
        return {"has_active_ride": False}

    driver = active_ride.driver

    return {
        "has_active_ride": True,
        "ride": {
            "ride_id": active_ride.id,
            "status": active_ride.status,
            "pickup_location": active_ride.pickup_location,
            "drop_location": active_ride.drop_location,
            "fare_estimate": float(active_ride.estimated_fare or 0),
            "created_at": active_ride.created_at,
            # 🔒 SAFE: expose driver only if accepted
            "driver": (
                {
                    "driver_id": driver.id
                }
                if driver
                else None
            ),
        },
    }
