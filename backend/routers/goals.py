"""
Роутер для работы с целями (CRUD)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from database import get_db
from models import Goal, User
from schemas import GoalCreate, GoalUpdate, GoalResponse

router = APIRouter(prefix="/goals", tags=["goals"])


@router.post("/", response_model=GoalResponse, status_code=201)
def create_goal(goal_data: GoalCreate, user_id: str = Query(...), db: Session = Depends(get_db)):
    """
    Создаёт новую цель для пользователя
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    if goal_data.period_start > goal_data.period_end:
        raise HTTPException(status_code=400, detail="Дата начала должна быть раньше даты окончания")
    
    new_goal = Goal(
        user_id=user_id,
        title=goal_data.title,
        type=goal_data.type,
        target=goal_data.target,
        unit=goal_data.unit,
        period_start=goal_data.period_start,
        period_end=goal_data.period_end,
        priority=goal_data.priority,
        notes=goal_data.notes
    )
    
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    
    return new_goal


@router.get("/", response_model=List[GoalResponse])
def get_goals(
    user_id: str = Query(...),
    active_only: bool = Query(False, description="Показать только активные цели"),
    db: Session = Depends(get_db)
):
    """
    Получает список целей пользователя
    Можно фильтровать только активные (не завершённые)
    """
    query = db.query(Goal).filter(Goal.user_id == user_id)
    
    if active_only:
        today = date.today()
        query = query.filter(Goal.period_end >= today)
    
    goals = query.order_by(Goal.priority.desc(), Goal.created_at.desc()).all()
    return goals


@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(goal_id: str, db: Session = Depends(get_db)):
    """
    Получает одну цель по ID
    """
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Цель не найдена")
    
    return goal


@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: str, goal_data: GoalUpdate, db: Session = Depends(get_db)):
    """
    Обновляет цель (частичное обновление)
    """
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Цель не найдена")
    
    update_data = goal_data.model_dump(exclude_unset=True)
    
    if "period_start" in update_data or "period_end" in update_data:
        start = update_data.get("period_start", goal.period_start)
        end = update_data.get("period_end", goal.period_end)
        if start > end:
            raise HTTPException(status_code=400, detail="Дата начала должна быть раньше даты окончания")
    
    for field, value in update_data.items():
        setattr(goal, field, value)
    
    db.commit()
    db.refresh(goal)
    
    return goal


@router.delete("/{goal_id}", status_code=204)
def delete_goal(goal_id: str, db: Session = Depends(get_db)):
    """
    Удаляет цель и все связанные логи (cascade)
    """
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Цель не найдена")
    
    db.delete(goal)
    db.commit()
    
    return None
