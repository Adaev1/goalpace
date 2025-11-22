from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings

settings = get_settings()

app = FastAPI(
    title="GoalPace API",
    description="API для планирования учебных целей и трекинга прогресса",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "GoalPace API работает"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
