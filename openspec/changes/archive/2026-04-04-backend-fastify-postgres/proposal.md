## Why

Проекту DailyDo необходим полноценный backend-сервер для обслуживания API-контракта, описанного в `openspec/specs/api-contract/spec.md`. Текущая архитектура предполагает in-memory хранилище, но для продакшн-готовности нужен реальный persistence layer на PostgreSQL с возможностью локальной разработки через Docker.

## What Changes

- **Backend**: создание Node.js сервера на Fastify, реализующего все эндпоинты из API-контракта (`GET/POST /api/lists`, `GET/DELETE/PUT /api/lists/:id`, `PATCH /api/lists/:id/tasks/:taskId`)
- **Архитектура**: слоистая архитектура с паттерном Repository (routes → service → repository → PostgreSQL)
- **База данных**: PostgreSQL, развёрнутый локально в Docker через docker-compose
- **Тестирование**: API-тесты (интеграционные, через HTTP) и unit-тесты для service/repository слоёв
- **Платформа**: backend

## Capabilities

### New Capabilities
- `backend-server`: Fastify-сервер с роутами, сервисным слоем, repository-паттерном и PostgreSQL хранилищем
- `backend-testing`: API-тесты и unit-тесты для backend (Jest)

### Modified Capabilities
_(нет изменений в существующих спецификациях — backend реализует уже описанный контракт)_

## Impact

- **Код**: новая директория `backend/` с полной структурой Fastify-приложения
- **API**: реализация всех эндпоинтов из `api-contract` спецификации
- **Зависимости**: fastify, @fastify/cors, pg (node-postgres), docker-compose для PostgreSQL
- **Инфраструктура**: `docker-compose.yml` для локального PostgreSQL
- **Тестирование**: Jest + supertest для API-тестов, Jest для unit-тестов
