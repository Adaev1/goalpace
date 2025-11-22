# GoalPace

Web-приложение для планирования учебных целей на месяц и ежедневного учёта прогресса.

## Структура проекта

```
goalpace/
├── backend/         # FastAPI + SQLAlchemy + SQLite
├── frontend/        # Next.js + React + Tailwind CSS
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
- **Next.js** — React фреймворк
- **Tailwind CSS** — стилизация
- **Chart.js / Recharts** — графики
- **TypeScript** — типизация

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
- ✅ Создание и редактирование целей
- ✅ Ежедневный учёт прогресса
- ✅ Dashboard с прогресс-барами
- ✅ Отчёты за неделю/месяц

## Лицензия

Учебный проект для курсовой работы
