#!/usr/bin/env python3
"""
Скрипт для проверки работы моделей БД
"""
from datetime import date, datetime
from database import SessionLocal
from models import User, Goal, Log, GoalType, GoalUnit


def test_models():
    db = SessionLocal()
    
    try:
        # Создаём тестового пользователя
        user = User(
            email="test@example.com",
            tz="Europe/Moscow"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"✅ Пользователь создан: {user.id}")
        
        # Создаём тестовую цель
        goal = Goal(
            user_id=user.id,
            title="Изучить Python",
            type=GoalType.TIME,
            target=40.0,
            unit=GoalUnit.HOURS,
            period_start=date(2025, 11, 1),
            period_end=date(2025, 11, 30),
            priority=2,
            notes="Курсовая работа"
        )
        db.add(goal)
        db.commit()
        db.refresh(goal)
        print(f"✅ Цель создана: {goal.title} (ID: {goal.id})")
        
        # Создаём тестовый лог
        log = Log(
            goal_id=goal.id,
            log_date=date(2025, 11, 22),
            minutes_spent=120,
            count_done=0,
            note="Работал над проектом"
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        print(f"✅ Лог создан: {log.log_date}, {log.minutes_spent} минут")
        
        # Проверяем relationships
        print(f"\n📊 Статистика:")
        print(f"- У пользователя {user.email} целей: {len(user.goals)}")
        print(f"- У цели '{goal.title}' логов: {len(goal.logs)}")
        
        print("\n✅ Все модели работают корректно!")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    test_models()
