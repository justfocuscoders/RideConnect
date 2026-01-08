from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.db.models.payment import Payment


def seed_payments():
    db: Session = SessionLocal()

    try:
        now = datetime.now(timezone.utc)

        seed_data = [
            # 3 days ago – ride 2
            Payment(
                ride_id=2,          # ✅ EXISTS in rides table
                user_id=1,          # ensure this user exists
                driver_id=1,        # ensure this driver exists
                amount=250.0,
                commission=25.0,
                driver_earning=225.0,
                status="completed",
                created_at=now - timedelta(days=3),
            ),

            # 2 days ago – ride 3
            Payment(
                ride_id=3,          # ✅ EXISTS in rides table
                user_id=1,
                driver_id=2,
                amount=300.0,
                commission=30.0,
                driver_earning=270.0,
                status="completed",
                created_at=now - timedelta(days=2),
            ),
        ]

        db.add_all(seed_data)
        db.commit()

        print("✅ Dummy analytics payments seeded successfully")

    except Exception as e:
        db.rollback()
        print("❌ Seeding failed:", e)

    finally:
        db.close()


if __name__ == "__main__":
    seed_payments()
