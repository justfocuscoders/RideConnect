from app.schemas.ride import RideOut

FARE_PER_KM = 13


def build_ride_out(ride):
    return RideOut(
        id=ride.id,
        user_id=ride.user_id,
        driver_id=ride.driver_id,
        pickup_location=ride.pickup_location,
        drop_location=ride.drop_location,
        status=ride.status,
        distance_km=ride.distance_km,
        estimated_fare=int(ride.distance_km * FARE_PER_KM),
        created_at=ride.created_at,
    )
