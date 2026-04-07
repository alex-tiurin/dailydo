# DailyDo — API Contract

Контракт HTTP-API между клиентами (webapp на Next.js, мобильное приложение на Compose Multiplatform) и backend на Fastify + PostgreSQL.

- **Base URL (dev):** `http://localhost:3001`
- **Префикс ресурсов:** `/api`
- **Формат данных:** JSON (UTF-8)
- **OpenAPI / Swagger UI:** `GET /docs` (интерактивная документация поднимается сервером)
- **CORS:** разрешён origin из env `CORS_ORIGIN` (по умолчанию `http://localhost:3000`)

## Содержание

1. [Соглашения](#соглашения)
2. [Модели данных](#модели-данных)
3. [Эндпоинты](#эндпоинты)
   - [GET /api/lists](#get-apilists)
   - [POST /api/lists](#post-apilists)
   - [GET /api/lists/:id](#get-apilistsid)
   - [PUT /api/lists/:id](#put-apilistsid)
   - [DELETE /api/lists/:id](#delete-apilistsid)
   - [DELETE /api/lists](#delete-apilists)
   - [PATCH /api/lists/:id/tasks/:taskId](#patch-apilistsidtaskstaskid)
4. [Коды ошибок](#коды-ошибок)
5. [Конфигурация клиентов](#конфигурация-клиентов)

---

## Соглашения

| Тема | Правило |
|---|---|
| Идентификаторы | `UUID v4` (строки), генерируются сервером |
| Даты | ISO 8601, формат `YYYY-MM-DD` (без времени), например `"2026-04-17"` |
| Сортировка списков | По полю `date` убыв., при равенстве — по `id` убыв. |
| Content-Type (запрос) | Для POST / PUT / PATCH обязательно `application/json` |
| Content-Type (ответ) | `application/json; charset=utf-8`, либо пусто для `204 No Content` |
| Аутентификация | **Отсутствует** (MVP, demo-режим) |
| Версионирование | Не используется; при мажорных изменениях планируется `/api/v2/...` |

---

## Модели данных

### `TaskList`

| Поле | Тип | Обязательное | Описание |
|---|---|---|---|
| `id` | `string` (UUID) | да | Идентификатор списка |
| `name` | `string` | да | Название списка (не пустое) |
| `date` | `string` (ISO date) | да | Дата создания списка, проставляется сервером |
| `tasks` | `Task[]` | да | Задачи списка (может быть пустым массивом) |

### `Task`

| Поле | Тип | Обязательное | Описание |
|---|---|---|---|
| `id` | `string` (UUID) | да | Идентификатор задачи |
| `name` | `string` | да | Текст задачи (не пустой) |
| `done` | `boolean` | да | Статус выполнения; при создании — `false` |

### `CreateListRequest`

| Поле | Тип | Обязательное | Валидация |
|---|---|---|---|
| `name` | `string` | да | `minLength: 1` |
| `tasks` | `Array<{ name: string }>` | да | Каждый элемент: `name` с `minLength: 1`. Допускается пустой массив |

### `UpdateTaskRequest`

| Поле | Тип | Обязательное | Валидация |
|---|---|---|---|
| `done` | `boolean` | нет | — |
| `name` | `string` | нет | `minLength: 1` |

Хотя бы одно из полей должно быть передано; иначе сервер не сможет применить изменение.

### `ErrorResponse`

Формат тела ошибок для 4xx / 5xx:

```json
{ "error": "List abc-123 not found" }
```

---

## Эндпоинты

### GET /api/lists

Возвращает все списки вместе с задачами.

- **Метод:** `GET`
- **Путь:** `/api/lists`
- **Параметры:** нет
- **Тело запроса:** нет

**Коды ответов**

| Код | Условие | Тело |
|---|---|---|
| `200 OK` | Успех (включая пустой массив, если списков нет) | `TaskList[]` |
| `500 Internal Server Error` | Ошибка на сервере | `ErrorResponse` |

**Пример ответа `200`**

```json
[
  {
    "id": "b7a1e8e2-4f3a-4c9f-8b1c-1f2a3b4c5d6e",
    "name": "Morning Routine",
    "date": "2026-04-17",
    "tasks": [
      { "id": "f1...", "name": "Wake up early", "done": true },
      { "id": "f2...", "name": "Meditate",      "done": false }
    ]
  }
]
```

---

### POST /api/lists

Создаёт новый список с задачами. Сервер генерирует `id` списка, `id` задач, а также `date` (текущая дата).

- **Метод:** `POST`
- **Путь:** `/api/lists`
- **Headers:** `Content-Type: application/json`

**Тело запроса** — `CreateListRequest`

```json
{
  "name": "Morning Routine",
  "tasks": [
    { "name": "Wake up early" },
    { "name": "Meditate" }
  ]
}
```

**Коды ответов**

| Код | Условие | Тело |
|---|---|---|
| `201 Created` | Список создан | `TaskList` (с `id`, `date`, `tasks[].id`, `tasks[].done=false`) |
| `400 Bad Request` | Нарушена схема тела (пустой `name`, отсутствует `tasks` и т. д.) | `ErrorResponse` (Fastify validation) |
| `500 Internal Server Error` | Ошибка на сервере | `ErrorResponse` |

---

### GET /api/lists/:id

Возвращает один список по идентификатору.

- **Метод:** `GET`
- **Путь:** `/api/lists/:id`
- **Path params:** `id` — UUID списка

**Коды ответов**

| Код | Условие | Тело |
|---|---|---|
| `200 OK` | Список найден | `TaskList` |
| `404 Not Found` | Списка с таким `id` нет | `ErrorResponse` |
| `500 Internal Server Error` | Ошибка на сервере | `ErrorResponse` |

---

### PUT /api/lists/:id

Обновляет имя списка. Изменение задач и даты через этот эндпоинт не поддерживается.

- **Метод:** `PUT`
- **Путь:** `/api/lists/:id`
- **Headers:** `Content-Type: application/json`

**Тело запроса**

```json
{ "name": "Updated list name" }
```

| Поле | Тип | Валидация |
|---|---|---|
| `name` | `string` | обязательное, `minLength: 1` |

**Коды ответов**

| Код | Условие | Тело |
|---|---|---|
| `200 OK` | Успех | обновлённый `TaskList` |
| `400 Bad Request` | Нарушена схема тела | `ErrorResponse` |
| `404 Not Found` | Списка нет | `ErrorResponse` |
| `500 Internal Server Error` | Ошибка на сервере | `ErrorResponse` |

---

### DELETE /api/lists/:id

Удаляет список вместе со всеми его задачами.

- **Метод:** `DELETE`
- **Путь:** `/api/lists/:id`
- **Тело запроса:** нет

**Коды ответов**

| Код | Условие | Тело |
|---|---|---|
| `204 No Content` | Успешно удалён | — |
| `404 Not Found` | Списка нет | `ErrorResponse` |
| `500 Internal Server Error` | Ошибка на сервере | `ErrorResponse` |

---

### DELETE /api/lists

Полностью очищает все списки и задачи (используется для тестов / демо-сброса).

> ⚠️ Деструктивная операция. В production-сборке планируется отключить или закрыть админ-аутентификацией.

- **Метод:** `DELETE`
- **Путь:** `/api/lists`
- **Тело запроса:** нет

**Коды ответов**

| Код | Условие | Тело |
|---|---|---|
| `204 No Content` | Успех (даже если данных не было) | — |
| `500 Internal Server Error` | Ошибка на сервере | `ErrorResponse` |

---

### PATCH /api/lists/:id/tasks/:taskId

Частичное обновление задачи: статус `done` и/или `name`.

- **Метод:** `PATCH`
- **Путь:** `/api/lists/:id/tasks/:taskId`
- **Headers:** `Content-Type: application/json`

**Тело запроса** — `UpdateTaskRequest`

```json
{ "done": true }
```

```json
{ "name": "Renamed task" }
```

```json
{ "done": false, "name": "Renamed task" }
```

**Коды ответов**

| Код | Условие | Тело |
|---|---|---|
| `200 OK` | Успех | обновлённый `Task` |
| `400 Bad Request` | Нарушена схема тела | `ErrorResponse` |
| `404 Not Found` | Не найден список или задача в этом списке | `ErrorResponse` |
| `500 Internal Server Error` | Ошибка на сервере | `ErrorResponse` |

---

## Коды ошибок

| Код | Значение | Когда возникает |
|---|---|---|
| `200 OK` | Успешный GET / PUT / PATCH | — |
| `201 Created` | Успешный POST | Создан новый список |
| `204 No Content` | Успешный DELETE | Удаление / очистка |
| `400 Bad Request` | Нарушена схема запроса | Fastify JSON Schema validator |
| `404 Not Found` | Ресурс не существует | `NotFoundError` из `listService` |
| `500 Internal Server Error` | Необработанная ошибка | Все прочие исключения |

Формат тела любой ошибки — `{ "error": string }`.

---

## Конфигурация клиентов

### Webapp (Next.js, `webapp/lib/api/client.ts`)

| Env | Значение по умолчанию | Назначение |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `/api` (same-origin) | Base URL, на который шлются запросы |

### Mobile (Compose Multiplatform, `composeApp/.../DailyDoApiClient.kt`)

Клиент получает `baseUrl` через `expect fun defaultBaseUrl()` с per-platform реализациями:

- **Android:** эмулятор обращается к хосту по `http://10.0.2.2:3001`
- **iOS simulator:** `http://localhost:3001`
- реальные устройства — через IP локальной машины / прод-домен

### Backend

| Env | Значение по умолчанию | Назначение |
|---|---|---|
| `PORT` | `3001` | Порт Fastify-сервера |
| `DATABASE_URL` | `postgresql://dailydo:dailydo@localhost:5433/dailydo` | PostgreSQL |
| `CORS_ORIGIN` | `http://localhost:3000` | Разрешённый origin для CORS |
