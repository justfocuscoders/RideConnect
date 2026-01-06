from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import Base
from app.db.session import engine

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.rides import router as rides_router
from app.api.driver import router as driver_router
from app.api import payments, driver_earnings
from app.api import payment_analytics
from app.api.health import router as admin_router
from app.api.admin_analytics import router as admin_analytics_router




app = FastAPI(title="RideConnect API")

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROUTERS
# =========================
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(rides_router)
app.include_router(driver_router)
app.include_router(payments.router)
app.include_router(driver_earnings.router)
app.include_router(payment_analytics.router)
app.include_router(admin_router)
app.include_router(admin_analytics_router)

# =========================
# DB INIT
# =========================
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "RideConnect backend is running"}
