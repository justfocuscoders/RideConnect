from datetime import timedelta

# JWT configuration
SECRET_KEY = "rideconnect-secret-key-change-this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
DATABASE_URL: str = "mysql+pymysql://root:@localhost:3306/rideconnect_db"
