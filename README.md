# GoalPace

Веб-приложение для постановки целей и ежедневного отслеживания прогресса. Поддерживает цели по времени (часы, минуты) и по количеству (страницы, задачи и т.д.). Есть генерация плана с помощью ИИ.

## Возможности

- Создание целей с подзадачами и дедлайнами
- Генерация плана через ИИ (автоматическое разбиение цели на подзадачи)
- Логирование ежедневного прогресса
- Прогресс-бары и статусы (по плану / отставание / завершено)
- Страница аналитики: итоги месяца, streak, график активности
- Простая авторизация по email

## Стек

| Слой | Технологии |
|------|-----------|
| Backend | FastAPI, SQLAlchemy, Alembic, Pydantic v2, SQLite |
| Frontend | React 19, Vite, Tailwind CSS 4, React Router |
| ИИ | Ollama |

## Запуск

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
```

Backend запустится на `http://localhost:8000`. Документация API доступна по адресу `http://localhost:8000/docs`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend запустится на `http://localhost:5173`. Запросы к API проксируются автоматически через Vite.

### 3. Docker (альтернативный способ)

Можно запустить весь проект одной командой через Docker:

```bash
docker-compose up --build
```

Приложение будет доступно на `http://localhost`. Nginx раздает фронтенд и проксирует API-запросы на backend.

Для остановки:

```bash
docker-compose down
```

## Структура проекта

```
backend/
  main.py            — точка входа, подключение роутеров
  models/models.py   — модели User, Goal, Subgoal, Log
  schemas/schemas.py — Pydantic-схемы запросов и ответов
  routers/           — эндпоинты (auth, goals, logs, reports, ai)
  alembic/           — миграции БД
  config.py          — настройки (URL Ollama, модель)

frontend/
  src/
    pages/           — Dashboard, Analytics, LoginPage
    components/      — GoalCard, модалки, Sidebar, Toast
    api/goals.js     — функции для работы с API
```

## Лицензия

Учебный проект для курсовой работы
