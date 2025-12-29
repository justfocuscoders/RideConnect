from fastapi import FastAPI

from app.db.base import Base
from app.db.session import engine
from app.db.models import user

app = FastAPI(title="RideConnect API")

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "RideConnect backend is running"}
