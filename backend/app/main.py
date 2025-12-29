from fastapi import FastAPI

from app.db.base import Base
from app.db.session import engine
from app.db.models import user
from app.db.session import get_db
from app.api.auth import router as auth_router
from app.db.models.user import User



app = FastAPI(title="RideConnect API")
app.include_router(auth_router)


Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "RideConnect backend is running"}
