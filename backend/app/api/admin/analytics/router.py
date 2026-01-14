from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_admin

router = APIRouter(
    prefix="/analytics",
    tags=["Admin Analytics"],
    dependencies=[Depends(get_current_admin)],
)

from .revenue import router as revenue_router
from .rides import router as rides_router
from .drivers import router as drivers_router
from .platform import router as platform_router

router.include_router(revenue_router)
router.include_router(rides_router)
router.include_router(drivers_router)
router.include_router(platform_router)
