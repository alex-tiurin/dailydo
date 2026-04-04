## 1. Project Setup

- [x] 1.1 Инициализировать `backend/` — `package.json`, `tsconfig.json`, установить зависимости (fastify, @fastify/cors, pg, uuid)
- [x] 1.2 Установить dev-зависимости (typescript, @types/pg, jest, ts-jest, @types/jest)
- [x] 1.3 Создать `docker-compose.yml` с PostgreSQL (порт 5432, база `dailydo`)
- [x] 1.4 Создать `src/db/init.sql` с таблицами `lists` и `tasks`
- [x] 1.5 Создать `src/config.ts` (порт, DB connection string, CORS origin)

## 2. Database Layer

- [x] 2.1 Создать `src/db/pool.ts` — экспорт pg Pool из конфига
- [x] 2.2 Создать `src/types.ts` — интерфейсы TaskList, Task, CreateListRequest, UpdateTaskRequest

## 3. Repository Layer

- [x] 3.1 Создать `src/repositories/listRepository.ts` — `findAll()`: SELECT всех списков с задачами, сортировка по date DESC
- [x] 3.2 Реализовать `findById(id)`: SELECT одного списка с задачами
- [x] 3.3 Реализовать `create(data)`: INSERT list + tasks в транзакции, вернуть созданный TaskList
- [x] 3.4 Реализовать `update(id, name)`: UPDATE имени списка, вернуть обновлённый TaskList
- [x] 3.5 Реализовать `remove(id)`: DELETE списка (каскадное удаление задач)
- [x] 3.6 Реализовать `updateTask(listId, taskId, data)`: UPDATE задачи (done/name)

## 4. Service Layer

- [x] 4.1 Создать `src/services/listService.ts` — методы: getAllLists, getListById, createList, updateList, deleteList, updateTask
- [x] 4.2 Добавить обработку ошибок (not found → выбрасывает ошибку, которую route обработает как 404)

## 5. Routes

- [x] 5.1 Создать `src/routes/lists.ts` — зарегистрировать все эндпоинты как Fastify plugin
- [x] 5.2 `GET /api/lists` — вызов service.getAllLists(), ответ 200
- [x] 5.3 `POST /api/lists` — валидация body, вызов service.createList(), ответ 201
- [x] 5.4 `GET /api/lists/:id` — вызов service.getListById(), ответ 200 или 404
- [x] 5.5 `PUT /api/lists/:id` — валидация body, вызов service.updateList(), ответ 200 или 404
- [x] 5.6 `DELETE /api/lists/:id` — вызов service.deleteList(), ответ 204 или 404
- [x] 5.7 `PATCH /api/lists/:id/tasks/:taskId` — валидация body, вызов service.updateTask(), ответ 200 или 404

## 6. App & Server

- [x] 6.1 Создать `src/app.ts` — инициализация Fastify, регистрация CORS и routes plugin
- [x] 6.2 Создать `src/server.ts` — entry point, вызов app.listen на порту 3001

## 7. Unit Tests

- [x] 7.1 Настроить Jest (`jest.config.ts`, ts-jest)
- [x] 7.2 Написать unit-тесты для `listService` с мок-ами repository (getAllLists, createList, getListById, updateList, deleteList, updateTask)

## 8. API Tests

- [x] 8.1 Создать test helper: сборка Fastify app + подключение к тестовой БД + truncate таблиц перед каждым тестом
- [x] 8.2 Тест `GET /api/lists` — пустой массив, массив с данными
- [x] 8.3 Тест `POST /api/lists` — успешное создание, ошибка валидации
- [x] 8.4 Тест `GET /api/lists/:id` — найден, не найден (404)
- [x] 8.5 Тест `PUT /api/lists/:id` — обновление, не найден (404)
- [x] 8.6 Тест `DELETE /api/lists/:id` — удаление (204), не найден (404)
- [x] 8.7 Тест `PATCH /api/lists/:id/tasks/:taskId` — toggle done, edit name, not found (404)

## 9. Scripts & Documentation

- [x] 9.1 Добавить npm-скрипты: `start`, `dev`, `build`, `test`, `test:watch`
- [x] 9.2 Проверить полный цикл: docker-compose up → npm run dev → npm test
