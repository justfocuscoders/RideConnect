from fastapi import APIRouter

from .profile import router as profile_router
from .dashboard import router as dashboard_router
from .rides import router as rides_router
from .payment_analytics import router as payments_router
from .payments import router as payment_analytics_router

router = APIRouter()

router.include_router(profile_router)
router.include_router(dashboard_router)
router.include_router(rides_router)
router.include_router(payments_router)
router.include_router(payment_analytics_router)
