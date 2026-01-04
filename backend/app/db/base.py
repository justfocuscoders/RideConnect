from sqlalchemy.orm import declarative_base

Base = declarative_base()

from sqlalchemy.orm import declarative_base

Base = declarative_base()

# IMPORTANT: import models so they register with Base.metadata
from app.db.models.user import User
from app.db.models.ride import Ride
from app.db.models.driver import Driver
from app.db.models.payment import Payment
from app.db.models.driver_earning import DriverEarning