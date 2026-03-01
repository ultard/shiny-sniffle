# Untilted

Это полнофункциональное веб-приложение с реализованным бэкендом и фронтендом, полностью связанными между собой.

## Технологии
- **Backend**: Node.js + Express.js
- **Frontend**: React.js
- **Интеграция**: Frontend полностью подключен к backend через API эндпоинты с помощью axios


## Что реализовано
- Полноценный backend на Express с маршрутами, middleware и обработкой ошибок
- Современный frontend на React с динамическим контентом
- Связь между frontend и backend через HTTP-запросы (axios)
- Подробная документация API

## Запуск проекта

### Backend
```bash
cd ./prac4/backend
npm install
npm dev
```
Сервер запустится на `http://localhost:3000`

### Frontend
```bash
cd ./prac4/frontend
npm install
npm start
```
Приложение откроется на `http://localhost:5173`

## Документация
- **API Docs**: [Swagger/OpenAPI](http://localhost:3001/api-docs) — полная спецификация всех endpoints
- **Компоненты React**: `./frontend/src/components/` — структура и props
- **Database Schema**: `./docs/database.md` — схема БД и миграции
