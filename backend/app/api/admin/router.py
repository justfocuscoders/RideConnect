from fastapi import APIRouter

from .health import router as health_router
from .analytics import router as analytics_router
from .driver_analytics import router as driver_analytics_router

router = APIRouter()

router.include_router(health_router)
router.include_router(analytics_router)
router.include_router(driver_analytics_router)
