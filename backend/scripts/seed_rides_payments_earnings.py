from datetime import datetime
import random
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
# CONFIG
# ======================================================
TOTAL_RIDES = 300
COMMISSION_RATE = 0.20

cities = ["Pune", "Mumbai", "Nagpur", "Nashik", "Kolhapur", "Solapur"]

# ======================================================
# 1. FETCH USERS & DRIVERS
# ======================================================
cursor.execute("SELECT id FROM users WHERE role = 'user'")
user_ids = [row[0] for row in cursor.fetchall()]

cursor.execute("SELECT id FROM drivers")
driver_ids = [row[0] for row in cursor.fetchall()]

if not user_ids or not driver_ids:
    raise Exception("❌ Users or drivers missing. Seed users/drivers first.")

# ======================================================
# 2. INSERT RIDES
# ======================================================
print("Inserting rides...")

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
        user_id,
        pickup_location,
        drop_location,
        status,
        estimated_fare,
        distance_km,
        created_at,
        driver_id
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
""", rides)

db.commit()
print(f"✅ {len(rides)} rides inserted")

# ======================================================
# 3. INSERT PAYMENTS (ONLY COMPLETED RIDES, NO DUPLICATES)
# ======================================================
print("Inserting payments...")

cursor.execute("""
    SELECT r.id, r.user_id, r.driver_id, r.estimated_fare
    FROM rides r
    LEFT JOIN payments p ON p.ride_id = r.id
    WHERE r.status = 'completed'
      AND p.id IS NULL
""")

payments = []
for ride_id, user_id, driver_id, fare in cursor.fetchall():
    commission = int(fare * COMMISSION_RATE)
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
            ride_id,
            user_id,
            driver_id,
            amount,
            commission,
            driver_earning,
            status,
            created_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, payments)
    db.commit()

print(f"✅ {len(payments)} payments inserted")

# ======================================================
# 4. INSERT DRIVER EARNINGS (NO DUPLICATES)
# ======================================================
print("Inserting driver earnings...")

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
        INSERT INTO driver_earnings (
            driver_id,
            payment_id,
            amount
        )
        VALUES (%s, %s, %s)
    """, earnings)
    db.commit()

print(f"✅ {len(earnings)} driver earnings inserted")

# ======================================================
# DONE
# ======================================================
cursor.close()
db.close()

print("🎉 RIDES, PAYMENTS & DRIVER EARNINGS SEEDING COMPLETE")
