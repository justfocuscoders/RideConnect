from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.models.ride import Ride
from app.db.models.payment import Payment


def get_user_dashboard_summary(db: Session, user_id: int):
    total_rides = db.query(func.count(Ride.id)) \
        .filter(Ride.user_id == user_id) \
        .scalar() or 0

    completed_rides = db.query(func.count(Ride.id)) \
        .filter(
            Ride.user_id == user_id,
            Ride.status == "completed"
        ).scalar() or 0

    cancelled_rides = db.query(func.count(Ride.id)) \
        .filter(
            Ride.user_id == user_id,
            Ride.status == "cancelled"
        ).scalar() or 0

    total_spent = db.query(func.coalesce(func.sum(Payment.amount), 0)) \
        .filter(Payment.user_id == user_id) \
        .scalar()

    return {
        "total_rides": total_rides,
        "completed_rides": completed_rides,
        "cancelled_rides": cancelled_rides,
        "total_spent": float(total_spent),
    }


def get_user_rides(db: Session, user_id: int):
    return db.query(Ride) \
        .filter(Ride.user_id == user_id) \
        .order_by(Ride.created_at.desc()) \
        .limit(10) \
        .all()


def get_user_payments(db: Session, user_id: int):
    return db.query(Payment) \
        .filter(Payment.user_id == user_id) \
        .order_by(Payment.created_at.desc()) \
        .limit(10) \
        .all()
