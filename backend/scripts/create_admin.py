import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))


import mysql.connector
from app.core.security import get_password_hash

# DATABASE CONFIG
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="rideconnect_db"
)

cursor = db.cursor()

ADMIN_EMAIL = "admin@rc.com"
ADMIN_PASSWORD = "Admin@123"

# CHECK IF ADMIN EXISTS
cursor.execute(
    "SELECT id FROM users WHERE email = %s",
    (ADMIN_EMAIL,)
)
admin = cursor.fetchone()

if admin:
    print("⚠️ Admin already exists. Skipping creation.")
else:
    cursor.execute("""
        INSERT INTO users (
            email,
            hashed_password,
            name,
            phone,
            role,
            is_active
        )
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        ADMIN_EMAIL,
        get_password_hash(ADMIN_PASSWORD),
        "Admin",
        "9767459770",
        "admin",
        1
    ))

    db.commit()
    print("✅ Admin created successfully")

cursor.close()
db.close()
