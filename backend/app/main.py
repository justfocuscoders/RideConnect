from fastapi import FastAPI

from app.db.base import Base
from app.db.session import engine

from app.api.auth import router as auth_router
from app.api.users import router as users_router


app = FastAPI(title="RideConnect API")

# Include API routers
app.include_router(auth_router)
app.include_router(users_router)

# Create DB tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "RideConnect backend is running"}
