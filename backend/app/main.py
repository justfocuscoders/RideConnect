from fastapi import FastAPI

app = FastAPI(title="RideConnect API")

@app.get("/")
def root():
    return {"message": "RideConnect backend is running"}
