from sqlalchemy.orm import Session
from app.db.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash


def create_user(db: Session, user_in: UserCreate):
    user = User(
        email=user_in.email,
        name=user_in.name,          # ✅ ADD
        phone=user_in.phone,        # ✅ ADD
        hashed_password=get_password_hash(user_in.password),
        is_active=user_in.is_active,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user



def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def update_user(db: Session, user: User, data: dict):
    for key, value in data.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user