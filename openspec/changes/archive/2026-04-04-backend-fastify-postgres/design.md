## Context

DailyDo — приложение для ежедневного трекинга задач. API-контракт уже определён в `openspec/specs/api-contract/spec.md`. Webapp (Next.js) реализует HTTP-клиент. Необходимо создать backend, реализующий этот контракт с реальным persistence на PostgreSQL.

Текущее состояние: backend отсутствует, в CLAUDE.md описан как «планируется» с in-memory хранилищем. Мы переходим сразу к PostgreSQL для production-ready решения.

## Goals / Non-Goals

**Goals:**
- Реализовать все эндпоинты из API-контракта на Fastify
- Слоистая архитектура: routes → service → repository → PostgreSQL
- Локальная БД через docker-compose
- Покрытие API-тестами и unit-тестами (Jest)
- CORS для работы с webapp на другом порту

**Non-Goals:**
- Аутентификация и авторизация (не в скоупе)
- Деплой в облако (только локальная разработка)
- ORM (используем чистый SQL через node-postgres)
- Миграции через специализированный инструмент (простой init-скрипт)

## Decisions

### 1. Fastify вместо Express
**Выбор**: Fastify
**Обоснование**: Выше производительность, встроенная валидация через JSON Schema, нативная поддержка TypeScript, plugin-архитектура. Express — более популярен, но Fastify лучше подходит для нового проекта.

### 2. Чистый SQL (node-postgres) вместо ORM
**Выбор**: `pg` (node-postgres) напрямую
**Обоснование**: Модель данных простая (2 таблицы: lists, tasks). ORM (Prisma, TypeORM) избыточен и добавляет сложность. Чистый SQL прозрачнее и проще для отладки.
**Альтернативы**: Prisma (удобные миграции, но overhead для 2 таблиц), Knex (query builder — промежуточный вариант, но не оправдан при простых запросах).

### 3. Структура слоёв
```
backend/
├── src/
│   ├── app.ts              # Fastify instance, plugin registration
│   ├── server.ts           # Entry point (listen)
│   ├── config.ts           # Environment config
│   ├── routes/
│   │   └── lists.ts        # Route handlers (HTTP → Service)
│   ├── services/
│   │   └── listService.ts  # Business logic
│   ├── repositories/
│   │   └── listRepository.ts  # SQL queries
│   ├── db/
│   │   ├── pool.ts         # pg Pool setup
│   │   └── init.sql        # CREATE TABLE statements
│   └── types.ts            # Shared TypeScript types
├── tests/
│   ├── api/                # Integration tests (HTTP)
│   └── unit/               # Unit tests (service, repository)
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── jest.config.ts
```

### 4. Схема БД
```sql
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);
```
`ON DELETE CASCADE` на tasks — при удалении списка задачи удаляются автоматически.

### 5. Инициализация БД
**Выбор**: init.sql скрипт, выполняемый при старте через docker-compose volume mount
**Обоснование**: Для демо-проекта не нужен полноценный migration tool. Docker entrypoint выполнит init.sql автоматически.

### 6. Тестирование
- **API-тесты**: Jest + `fastify.inject()` (встроенный в Fastify, не требует supertest). Поднимают реальный Fastify instance, обращаются к тестовой БД.
- **Unit-тесты**: Jest с мок-ами зависимостей. Тестируют service-слой изолированно.
- **Тестовая БД**: Отдельная PostgreSQL БД (или та же с очисткой таблиц между тестами).

### 7. Порт и CORS
- Backend слушает на порту `3001` (webapp на `3000`)
- CORS разрешает `http://localhost:3000`

## Risks / Trade-offs

- **[Нет миграций]** → При изменении схемы придётся пересоздавать БД. Допустимо для текущего этапа; при необходимости добавим node-pg-migrate.
- **[Docker-зависимость]** → Для разработки нужен Docker. Это стандартный инструмент, риск минимален.
- **[Нет connection pooling тюнинга]** → pg Pool с дефолтными настройками. Достаточно для локальной разработки.
- **[Тесты зависят от БД]** → API-тесты требуют запущенный PostgreSQL. Решение: docker-compose для тестовой БД или тот же контейнер.
