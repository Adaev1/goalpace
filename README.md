# GoalPace

Web-приложение для планирования учебных целей на месяц и ежедневного учёта прогресса.

## Структура проекта

```
goalpace/
├── backend/         # FastAPI + SQLAlchemy + SQLite
├── frontend/        # React + Vite + Tailwind CSS
└── README.md
```

## Технологии

### Backend
- **FastAPI** — веб-фреймворк
- **SQLAlchemy** — ORM для работы с БД
- **SQLite** — база данных
- **Alembic** — миграции БД
- **Pydantic v2** — валидация данных

### Frontend
- **React** — UI библиотека
- **Vite** — сборщик
- **Tailwind CSS** — стилизация
- **React Router** — маршрутизация

## Быстрый старт

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # для Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Разработка

Проект находится в разработке. MVP включает:
- Создание целей с подзадачами
- Ежедневный учёт прогресса
- Dashboard с прогресс-барами
- Красная линия (идеальный темп)

## Лицензия

Учебный проект для курсовой работы
