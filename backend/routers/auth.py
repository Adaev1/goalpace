"""
Роутер для демо-авторизации
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/demo", response_model=UserResponse)
def get_or_create_demo_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Создаёт или возвращает демо-пользователя
    Простая авторизация для MVP без паролей
    """
    # Проверяем, есть ли уже пользователь с таким email
    if user_data.email:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            return existing_user
    
    # Создаём нового пользователя
    new_user = User(
        email=user_data.email,
        tz=user_data.tz
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user
