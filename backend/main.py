from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from database import engine, Base
from models import User, Goal, Log

settings = get_settings()

Base.metadata.create_all(bind=engine)

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

# Подключаем роутеры
from routers import auth, goals, logs, reports
app.include_router(auth.router)
app.include_router(goals.router)
app.include_router(logs.router)
app.include_router(reports.router)


@app.get("/")
def root():
    return {"message": "GoalPace API работает"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
