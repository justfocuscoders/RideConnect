from datetime import datetime
import random
import mysql.connector

# IMPORTANT: same hasher used by FastAPI
from app.core.security import get_password_hash

# ======================================================
# DATABASE CONFIG
# ======================================================
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="rideconnect_db"
)

cursor = db.cursor()

# ======================================================
# CONFIG
# ======================================================
TOTAL_USERS = 300
TOTAL_DRIVERS = 85

USER_PASSWORD = "User@123"
DRIVER_PASSWORD = "Driver@123"

# ======================================================
# HELPERS
# ======================================================
def random_phone():
    return "9" + "".join(str(random.randint(0, 9)) for _ in range(9))

# ======================================================
# 1. ENSURE ADMIN EXISTS (DO NOT TOUCH)
# ======================================================
cursor.execute("SELECT id FROM users WHERE role = 'admin'")
admin = cursor.fetchone()

if not admin:
    raise Exception("❌ Admin not found. Create admin first before running bulk seeder.")

print("✅ Admin exists. Proceeding with bulk seeding...")

# ======================================================
# 2. INSERT DRIVER USERS (85)
# ======================================================
print("Inserting driver users...")

cursor.execute("SELECT email FROM users")
existing_emails = {row[0] for row in cursor.fetchall()}

driver_users = []
for i in range(1, TOTAL_DRIVERS + 1):
    email = f"driver{i}@gmail.com"
    if email in existing_emails:
        continue

    driver_users.append((
        email,
        get_password_hash(DRIVER_PASSWORD),
        f"Driver {i}",
        random_phone(),
        1,
        datetime.now(),
        "driver"
    ))

if driver_users:
    cursor.executemany("""
        INSERT INTO users (
            email, hashed_password, name,
            phone, is_active, created_at, role
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, driver_users)
    db.commit()

print(f"✅ Driver users inserted: {len(driver_users)}")

# ======================================================
# 3. INSERT NORMAL USERS (300)
# ======================================================
print("Inserting normal users...")

user_accounts = []
for i in range(1, TOTAL_USERS + 1):
    email = f"user{i}@gmail.com"
    if email in existing_emails:
        continue

    user_accounts.append((
        email,
        get_password_hash(USER_PASSWORD),
        f"User {i}",
        random_phone(),
        1,
        datetime.now(),
        "user"
    ))

if user_accounts:
    cursor.executemany("""
        INSERT INTO users (
            email, hashed_password, name,
            phone, is_active, created_at, role
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, user_accounts)
    db.commit()

print(f"✅ Normal users inserted: {len(user_accounts)}")

# ======================================================
# 4. INSERT DRIVERS TABLE ROWS (FOR DRIVER USERS)
# ======================================================
print("Creating driver profiles...")

cursor.execute("""
    SELECT u.id
    FROM users u
    LEFT JOIN drivers d ON d.user_id = u.id
    WHERE u.role = 'driver' AND d.id IS NULL
""")

driver_user_ids = [row[0] for row in cursor.fetchall()]

drivers = []
for user_id in driver_user_ids:
    drivers.append((
        user_id,
        f"LIC{random.randint(10000,99999)}",
        f"MH{random.randint(10,99)}AB{random.randint(1000,9999)}",
        random.choice(["car", "bike"]),
        1,
        1,
        datetime.now(),
        datetime.now()
    ))

if drivers:
    cursor.executemany("""
        INSERT INTO drivers (
            user_id, license_number, vehicle_number,
            vehicle_type, is_verified, is_available,
            created_at, updated_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, drivers)
    db.commit()

print(f"✅ Driver profiles created: {len(drivers)}")

# ======================================================
# DONE
# ======================================================
cursor.close()
db.close()

print("🎉 BULK USER & DRIVER SEEDING COMPLETED SUCCESSFULLY")
