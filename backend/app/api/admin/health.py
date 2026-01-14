from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_admin

router = APIRouter(
    prefix="/health",
    tags=["Admin"]
)

@router.get("")
def admin_health(
    admin = Depends(get_current_admin)
):
    return {
        "status": "ok",
        "admin_email": admin.email
    }
