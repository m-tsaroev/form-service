# Разработка

## Требования

- Node.js 20 или новее
- npm

## Запуск

Из корня репозитория:

```bash
npm install
npm start
```

Для разработки с Vite и автоматическим перезапуском сервера:

```bash
npm run dev
```

Клиент доступен на `http://localhost:5173`, сервер — на
`http://localhost:3000`.

## Проверки

Перед коммитом запускайте подходящие проверки:

```bash
npm run typecheck
npm run lint
npm run build
npm test
git diff --check
```

Серверные тесты используют отдельную временную SQLite-базу. Рабочие данные из
`data/app.db` не должны использоваться для разрушительных тестов.

## Структура проекта

- `client/src/pages` — тонкие страницы и маршрутизация;
- `client/src/widgets` — составные блоки интерфейса;
- `client/src/entities` — предметные модели и API сущностей;
- `client/src/features` — пользовательские сценарии;
- `client/src/shared` — переиспользуемые UI-компоненты, API и конфигурация;
- `server/src/routes` — HTTP-маршруты;
- `server/src/controllers` — преобразование HTTP-запросов и ответов;
- `server/src/services` — бизнес-логика;
- `server/src/repositories` — доступ к SQLite;
- `server/src/schemas` — runtime-валидация входных данных;
- `server/src/tests` — API-тесты.
