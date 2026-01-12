from fastapi import APIRouter

from .profile import router as profile_router
from .dashboard import router as dashboard_router
from .earnings import router as earnings_router
from .rides import router as rides_router
from .status import router as status_router
from app.api.drivers.active_ride import router as active_ride_router
from app.api.drivers import driver_rides

router = APIRouter(prefix="/drivers", tags=["Drivers"])

router.include_router(profile_router)
router.include_router(dashboard_router)
router.include_router(earnings_router)
router.include_router(rides_router)
router.include_router(status_router)
router.include_router(active_ride_router)
router.include_router(driver_rides.router)
