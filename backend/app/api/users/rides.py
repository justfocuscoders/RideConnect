from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import asyncio

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.core.validators import validate_status_transition
from app.core.ride_status import ALLOWED_STATUS_TRANSITIONS
from app.schemas.ride import RideCreate, RideOut, RideStatusUpdate
from app.db.repositories.ride import (
    create_ride,
    get_all_rides,
    get_ride_by_id,
    update_ride_status,
)
from app.websockets.manager import manager

router = APIRouter(prefix="/rides", tags=["Rides"])


# =========================
# CREATE RIDE  ✅ FIXED
# =========================
@router.post("", response_model=RideOut, status_code=status.HTTP_201_CREATED)
def create_new_ride(
    ride_data: RideCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    ride = create_ride(db, ride_data, current_user.id)

    # 🔔 REALTIME → DRIVERS
    asyncio.create_task(
        manager.broadcast_to_role(
            {
                "event": "ride_created",
                "data": {
                    "id": ride.id,  # ✅ CRITICAL FIX
                    "pickup_location": ride.pickup_location,
                    "drop_location": ride.drop_location,
                    "distance_km": ride.distance_km,
                    "estimated_fare": float(ride.estimated_fare),
                    "created_at": ride.created_at.isoformat(),
                },
            },
            role="driver",
        )
    )

    return ride


# =========================
# LIST RIDES
# =========================
@router.get("", response_model=List[RideOut])
def list_rides(db: Session = Depends(get_db)):
    return get_all_rides(db)


# =========================
# READ SINGLE RIDE
# =========================
@router.get("/{ride_id}", response_model=RideOut)
def read_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    ride = get_ride_by_id(db, ride_id)
    if not ride or ride.user_id != current_user.id:
        raise HTTPException(403, "Not authorized")
    return ride


# =========================
# CANCEL RIDE
# =========================
@router.patch("/{ride_id}/cancel")
def cancel_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    ride = get_ride_by_id(db, ride_id)
    if not ride or ride.user_id != current_user.id:
        raise HTTPException(403, "Not authorized")

    if ride.status in ("completed", "cancelled"):
        raise HTTPException(400, "Ride cannot be cancelled")

    updated = update_ride_status(db, ride.id, "cancelled")
    return {"id": updated.id, "status": updated.status}
