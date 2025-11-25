#!/usr/bin/env python3
"""
Тесты API endpoints для auth и goals
"""
import requests
from datetime import date

BASE_URL = "http://localhost:8000"


def test_auth_demo():
    """Тест создания демо-пользователя"""
    print("Тест 1: POST /auth/demo")
    
    response = requests.post(
        f"{BASE_URL}/auth/demo",
        json={
            "email": "test@goalpace.com",
            "tz": "Europe/Moscow"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    print(f"  ✅ Пользователь создан: {data['id']}")
    print(f"     Email: {data['email']}")
    
    return data['id']


def test_create_goal(user_id):
    """Тест создания цели"""
    print("\nТест 2: POST /goals")
    
    response = requests.post(
        f"{BASE_URL}/goals/?user_id={user_id}",
        json={
            "title": "Изучить FastAPI",
            "type": "time",
            "target": 30.0,
            "unit": "hours",
            "period_start": "2025-11-01",
            "period_end": "2025-11-30",
            "priority": 2,
            "notes": "Для курсовой"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    print(f"  ✅ Цель создана: {data['title']}")
    print(f"     ID: {data['id']}")
    print(f"     Target: {data['target']} {data['unit']}")
    
    return data['id']


def test_get_goals(user_id):
    """Тест получения списка целей"""
    print("\nТест 3: GET /goals")
    
    response = requests.get(f"{BASE_URL}/goals/?user_id={user_id}")
    
    assert response.status_code == 200
    data = response.json()
    print(f"  ✅ Получено целей: {len(data)}")
    for goal in data:
        print(f"     - {goal['title']} ({goal['target']} {goal['unit']})")


def test_get_goal(goal_id):
    """Тест получения одной цели"""
    print("\nТест 4: GET /goals/{id}")
    
    response = requests.get(f"{BASE_URL}/goals/{goal_id}")
    
    assert response.status_code == 200
    data = response.json()
    print(f"  ✅ Цель: {data['title']}")
    print(f"     Период: {data['period_start']} — {data['period_end']}")


def test_update_goal(goal_id):
    """Тест обновления цели"""
    print("\nТест 5: PUT /goals/{id}")
    
    response = requests.put(
        f"{BASE_URL}/goals/{goal_id}",
        json={
            "target": 40.0,
            "priority": 3,
            "notes": "Увеличил цель"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    print(f"  ✅ Цель обновлена")
    print(f"     Новая цель: {data['target']} {data['unit']}")
    print(f"     Приоритет: {data['priority']}")


def test_delete_goal(goal_id):
    """Тест удаления цели"""
    print("\nТест 6: DELETE /goals/{id}")
    
    response = requests.delete(f"{BASE_URL}/goals/{goal_id}")
    
    assert response.status_code == 204
    print(f"  ✅ Цель удалена")


def run_all_tests():
    print("=" * 50)
    print("Тестирование API endpoints")
    print("=" * 50)
    
    try:
        # Тест авторизации
        user_id = test_auth_demo()
        
        # Тесты целей
        goal_id = test_create_goal(user_id)
        test_get_goals(user_id)
        test_get_goal(goal_id)
        test_update_goal(goal_id)
        test_delete_goal(goal_id)
        
        print("\n" + "=" * 50)
        print("✅ Все тесты API пройдены!")
        print("=" * 50)
        
    except AssertionError as e:
        print(f"\n❌ Тест провален: {e}")
    except requests.exceptions.ConnectionError:
        print("\n❌ Не удалось подключиться к серверу")
        print("   Запусти сервер: cd backend && python3 -m uvicorn main:app --reload")
    except Exception as e:
        print(f"\n❌ Ошибка: {e}")


if __name__ == "__main__":
    run_all_tests()
