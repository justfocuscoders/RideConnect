import random
from datetime import datetime
import mysql.connector

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
# SEED COUNTS
# ======================================================
TOTAL_USERS = 300          # normal users
TOTAL_DRIVERS = 85         # drivers
TOTAL_RIDES = 300

# ======================================================
# HELPERS
# ======================================================
def random_phone():
    return "9" + "".join(str(random.randint(0, 9)) for _ in range(9))

cities = ["Pune", "Mumbai", "Nagpur", "Nashik", "Kolhapur", "Solapur"]

# ======================================================
# 0. INSERT ADMIN (ONLY ONE)
# ======================================================
print("Ensuring admin user exists...")

cursor.execute("SELECT id FROM users WHERE role = 'admin'")
admin_exists = cursor.fetchone()

if not admin_exists:
    cursor.execute("""
        INSERT INTO users (email, hashed_password, name, phone, is_active, created_at, role)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        "admin@gmail.com",
        "Admin@123",          # NOTE: plain for dev; hash in real app
        "Admin",
        "9999999999",
        1,
        datetime.now(),
        "admin"
    ))
    db.commit()

# ======================================================
# 1. INSERT USERS (300 NORMAL + 85 DRIVER USERS)
# ======================================================
print("Inserting users...")

cursor.execute("SELECT COUNT(*) FROM users WHERE role IN ('user','driver')")
existing_users = cursor.fetchone()[0]

users = []

total_to_create = TOTAL_USERS + TOTAL_DRIVERS

for idx in range(1, total_to_create + 1):
    role = "driver" if idx <= TOTAL_DRIVERS else "user"

    users.append((
        f"user{existing_users + idx}@gmail.com",
        f"hashed_password_{existing_users + idx}",
        f"User {existing_users + idx}",
        random_phone(),
        1,
        datetime.now(),
        role
    ))

if users:
    cursor.executemany("""
        INSERT INTO users (email, hashed_password, name, phone, is_active, created_at, role)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, users)
    db.commit()

# ======================================================
# 2. INSERT DRIVERS (ONLY FOR DRIVER USERS WITHOUT DRIVER ROW)
# ======================================================
print("Inserting drivers...")

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

# ======================================================
# 3. INSERT RIDES
# ======================================================
print("Inserting rides...")

cursor.execute("SELECT id FROM drivers")
driver_ids = [row[0] for row in cursor.fetchall()]

cursor.execute("SELECT id FROM users WHERE role = 'user'")
user_ids = [row[0] for row in cursor.fetchall()]

rides = []
for _ in range(TOTAL_RIDES):
    status = random.choice(["requested", "accepted", "completed"])
    fare = random.randint(100, 1500)
    distance = random.randint(5, 200)

    rides.append((
        random.choice(user_ids),
        random.choice(cities),
        random.choice(cities),
        status,
        fare,
        distance,
        datetime.now(),
        random.choice(driver_ids)
    ))

cursor.executemany("""
    INSERT INTO rides (
        user_id, pickup_location, drop_location,
        status, estimated_fare, distance_km,
        created_at, driver_id
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
""", rides)
db.commit()

# ======================================================
# 4. INSERT PAYMENTS (ONLY FOR COMPLETED & UNPAID RIDES)
# ======================================================
print("Inserting payments...")

cursor.execute("""
    SELECT r.id, r.estimated_fare, r.driver_id, r.user_id
    FROM rides r
    LEFT JOIN payments p ON p.ride_id = r.id
    WHERE r.status = 'completed'
      AND p.id IS NULL
""")

payments = []
for ride_id, fare, driver_id, user_id in cursor.fetchall():
    commission = int(fare * 0.2)
    driver_earning = fare - commission

    payments.append((
        ride_id,
        user_id,
        driver_id,
        fare,
        commission,
        driver_earning,
        "completed",
        datetime.now()
    ))

if payments:
    cursor.executemany("""
        INSERT INTO payments (
            ride_id, user_id, driver_id,
            amount, commission, driver_earning,
            status, created_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, payments)
    db.commit()

# ======================================================
# 5. INSERT DRIVER EARNINGS
# ======================================================
cursor.execute("""
    SELECT p.id, p.driver_id, p.driver_earning
    FROM payments p
    LEFT JOIN driver_earnings de ON de.payment_id = p.id
    WHERE de.id IS NULL
""")

earnings = [(driver_id, payment_id, amount)
            for payment_id, driver_id, amount in cursor.fetchall()]

if earnings:
    cursor.executemany("""
        INSERT INTO driver_earnings (driver_id, payment_id, amount)
        VALUES (%s, %s, %s)
    """, earnings)
    db.commit()

# ======================================================
# DONE
# ======================================================
cursor.close()
db.close()

print("✅ Database seeding completed successfully!")
