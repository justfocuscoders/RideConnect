from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import Base
from app.db.session import engine

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.drivers import router as drivers_router
from app.api.admin import router as admin_router

app = FastAPI(title="RideConnect API")

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

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(drivers_router)
app.include_router(admin_router)



Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "RideConnect backend is running"}
