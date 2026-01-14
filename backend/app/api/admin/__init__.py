from fastapi import APIRouter

from app.api.admin.health import router as health_router
from app.api.admin.driver_verification import router as driver_verification_router
from app.api.admin.analytics.router import router as analytics_router

router = APIRouter(prefix="/admin", tags=["Admin"])

router.include_router(health_router)
router.include_router(driver_verification_router)
router.include_router(analytics_router)
