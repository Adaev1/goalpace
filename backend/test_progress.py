#!/usr/bin/env python3
"""
Тесты для проверки расчётов прогресса
"""
from datetime import date
from models.models import Goal, Log, GoalType, GoalUnit
from progress import (
    calculate_progress_metrics,
    calculate_actual_progress,
    determine_status,
    get_daily_progress_series
)


def test_time_goal():
    """Тест цели по времени: 40 часов за ноябрь"""
    print("Тест 1: Цель по времени")
    
    goal = Goal(
        id="test-1",
        user_id="user-1",
        title="Изучить алгоритмы",
        type=GoalType.TIME,
        target=40.0,
        unit=GoalUnit.HOURS,
        period_start=date(2025, 11, 1),
        period_end=date(2025, 11, 30)
    )
    
    # 10 дней работали по 2 часа = 20 часов = 1200 минут
    logs = [
        Log(id=f"log-{i}", goal_id="test-1", log_date=date(2025, 11, i), 
            minutes_spent=120, count_done=0)
        for i in range(1, 11)
    ]
    
    # Проверяем на 15 ноября (половина месяца)
    metrics = calculate_progress_metrics(goal, logs, current_date=date(2025, 11, 15))
    
    print(f"  Факт: {metrics['actual']} ч")
    print(f"  Норма на 15.11: {metrics['required_by_today']} ч")
    print(f"  Дефицит: {metrics['deficit']} ч")
    print(f"  Процент: {metrics['percent']}%")
    print(f"  Статус: {metrics['status']}")
    
    assert metrics['actual'] == 20.0, "Должно быть 20 часов"
    assert 19 < metrics['required_by_today'] < 21, "Норма примерно 20 часов"
    assert metrics['status'] == "on_track", "Должны быть в норме"
    print("  ✅ Тест пройден\n")


def test_count_goal():
    """Тест цели по количеству: 12 посещений зала"""
    print("Тест 2: Цель по количеству")
    
    goal = Goal(
        id="test-2",
        user_id="user-1",
        title="Зал",
        type=GoalType.COUNT,
        target=12.0,
        unit=GoalUnit.COUNT,
        period_start=date(2025, 11, 1),
        period_end=date(2025, 11, 30)
    )
    
    # Ходили 4 раза
    logs = [
        Log(id=f"log-{i}", goal_id="test-2", log_date=date(2025, 11, i*3), 
            minutes_spent=0, count_done=1)
        for i in range(1, 5)
    ]
    
    metrics = calculate_progress_metrics(goal, logs, current_date=date(2025, 11, 15))
    
    print(f"  Факт: {metrics['actual']} раз")
    print(f"  Норма на 15.11: {metrics['required_by_today']} раз")
    print(f"  Процент: {metrics['percent']}%")
    print(f"  Статус: {metrics['status']}")
    
    assert metrics['actual'] == 4.0, "Должно быть 4 посещения"
    assert metrics['status'] == "at_risk", "Должны быть в риске (отставание)"
    print("  ✅ Тест пройден\n")


def test_behind_status():
    """Тест статуса 'behind' при большом отставании"""
    print("Тест 3: Большое отставание")
    
    goal = Goal(
        id="test-3",
        user_id="user-1",
        title="Программирование",
        type=GoalType.TIME,
        target=30.0,
        unit=GoalUnit.HOURS,
        period_start=date(2025, 11, 1),
        period_end=date(2025, 11, 30)
    )
    
    # Отработали только 3 часа за половину месяца
    logs = [
        Log(id="log-1", goal_id="test-3", log_date=date(2025, 11, 5), 
            minutes_spent=180, count_done=0)
    ]
    
    metrics = calculate_progress_metrics(goal, logs, current_date=date(2025, 11, 15))
    
    print(f"  Факт: {metrics['actual']} ч")
    print(f"  Норма: {metrics['required_by_today']} ч")
    print(f"  Отставание: {metrics['deficit']} ч")
    print(f"  Статус: {metrics['status']}")
    
    assert metrics['status'] == "behind", "Должен быть статус behind"
    print("  ✅ Тест пройден\n")


def test_daily_series():
    """Тест построения дневной серии для графика"""
    print("Тест 4: Дневная серия")
    
    goal = Goal(
        id="test-4",
        user_id="user-1",
        title="Чтение",
        type=GoalType.TIME,
        target=20.0,
        unit=GoalUnit.HOURS,
        period_start=date(2025, 11, 1),
        period_end=date(2025, 11, 30)
    )
    
    logs = [
        Log(id=f"log-{i}", goal_id="test-4", log_date=date(2025, 11, i), 
            minutes_spent=60, count_done=0)
        for i in range(1, 6)
    ]
    
    series = get_daily_progress_series(goal, logs)
    
    print(f"  Записей в серии: {len(series)}")
    print(f"  Первый день: {series[0]}")
    print(f"  Последний день: {series[-1]}")
    
    assert len(series) == 5, "Должно быть 5 дней"
    assert series[-1]['actual_cumulative'] == 5.0, "За 5 дней = 5 часов"
    print("  ✅ Тест пройден\n")


def run_all_tests():
    print("=" * 50)
    print("Запуск тестов расчёта прогресса")
    print("=" * 50 + "\n")
    
    try:
        test_time_goal()
        test_count_goal()
        test_behind_status()
        test_daily_series()
        
        print("=" * 50)
        print("✅ Все тесты пройдены успешно!")
        print("=" * 50)
        
    except AssertionError as e:
        print(f"\n❌ Тест провален: {e}")
    except Exception as e:
        print(f"\n❌ Ошибка: {e}")


if __name__ == "__main__":
    run_all_tests()
