# Form Service

Автономный сервис для создания и заполнения форм.

## Требования

- Node.js 20 или новее
- npm

## Запуск

```bash
npm install
npm start
```

Приложение будет доступно на <http://localhost:3000>. Другой порт можно
передать через переменную окружения `PORT`.

## Документация

- [Навигация по документации](docs/README.md)
- [Разработка и проверки](docs/development.md)
- [Архитектура](docs/architecture.md)
- [HTTP API](docs/api.md)
- [Журнал разработки с помощью ИИ](AI_LOG.md)

## Разработка

```bash
npm run dev
```

Vite запускается на <http://localhost:5173> и проксирует запросы `/api` на
Express-сервер по адресу <http://localhost:3000>.

Дополнительные команды:

- `npm run build` — проверка типов и production-сборка клиента;
- `npm run typecheck` — проверка TypeScript;
- `npm run lint` — проверка ESLint.
