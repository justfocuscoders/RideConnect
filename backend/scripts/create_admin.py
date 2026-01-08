from datetime import datetime
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

# CREATE ADMIN (ONLY ONCE)
cursor.execute("SELECT id FROM users WHERE role = 'admin'")
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
            is_active,
            created_at,
            role
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        "admin@gmail.com",
        get_password_hash("Admin@123"),
        "Admin",
        "9767459770",
        1,
        datetime.now(),
        "admin"
    ))

    db.commit()
    print("✅ Admin created successfully")

cursor.close()
db.close()
