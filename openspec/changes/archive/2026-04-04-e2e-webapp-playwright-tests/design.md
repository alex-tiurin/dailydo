## Context

В webapp уже есть integration-тесты (`tests/integration/`) с мокированным API — они проверяют контракт HTTP-запросов. E2e-тесты (`tests/e2e/`) будут работать против живого Next.js-приложения (встроенный in-memory backend), без моков. Приложение использует Next.js API routes как backend — данные хранятся в памяти процесса.

Существующая структура:
- `tests/integration/page-objects/` — MyListsPage, CreateListPage, ProgressViewPage (уже созданы)
- `playwright.config.ts` — настроен для `http://localhost:3000`, запускает `npm run dev`
- API: GET/POST `/api/lists`, GET/PUT/DELETE `/api/lists/:id`, PATCH `/api/lists/:id/tasks/:taskId`

## Goals / Non-Goals

**Goals:**
- Исследовательское тестирование с Playwright CLI для понимания реального состояния UI
- E2e-тесты навигации вперёд/назад между всеми тремя экранами
- E2e-тесты CRUD: создание списка, редактирование задачи (toggle done + rename), удаление списка
- Переиспользование существующих Page Objects из `tests/integration/page-objects/` — добавить в них методы для e2e flow
- Page Object Model с Step pattern (`test.step()`) согласно playwright-page-object skill
- E2e spec-файлы в `tests/e2e/`

**Non-Goals:**
- Создание дублирующих Page Objects в `tests/e2e/page-objects/`
- Изменение существующих integration-тестов
- Тестирование мобильного или iOS приложения
- Тесты производительности или визуальной регрессии

## Decisions

### Решение 1: Расширить существующие Page Objects

Добавляем новые методы прямо в `tests/integration/page-objects/MyListsPage.ts`, `CreateListPage.ts`, `ProgressViewPage.ts`. E2e-тесты импортируют те же классы. Это единственный источник истины для локаторов и действий.

**Какие методы добавить:**
- `MyListsPage`: `deleteList(listId)`, `verifyListDeleted(listId)`, `clickEditIcon(listId)`
- `ProgressViewPage`: `clickEditTask(taskId)`, `renameTask(taskId, name)`, `verifyTaskName(taskId, name)`, `verifyTaskInPendingSection(taskId)`, `verifyTaskInCompletedSection(taskId)`
- `CreateListPage`: методов достаточно, расширение не требуется

**Почему не создавать отдельные PO:** Дублирование локаторов — источник несинхронизированности. Один класс — одна точка изменения.

### Решение 2: Playwright CLI для исследовательского тестирования

Перед написанием тестов запускаем `playwright codegen http://localhost:3000` для интерактивного исследования: находим реальные data-testid, выявляем фактическое поведение UI (особенно edit task и delete list — в коде они есть частично).

### Решение 3: Step pattern для читаемости

Все сценарии оборачиваются в `test.step()` — читаемые trace-файлы, упрощённая отладка падений.

### Решение 4: Изоляция состояния через API

Каждый тест создаёт нужные данные через UI (Create flow) в `beforeEach`. Тесты на удаление создают данные сами. In-memory backend не сбрасывается между тестами — порядок важен, тесты не должны зависеть от seed-данных.

## Risks / Trade-offs

- **[Состояние между тестами]** → In-memory backend не сбрасывается между тестами в рамках одного сервера. Митигация: каждый e2e тест создаёт свои данные через UI.
- **[Редактирование задачи (rename)]** → В UI есть кнопка-карандаш (`task-edit-*`), но инлайн-редактирование может быть не реализовано. Исследовательское тестирование выявит реальное состояние — если фичи нет, тест на rename пишется как pending/skipped.
- **[Удаление списка]** → API DELETE существует, но в UI нет явной кнопки удаления. Playwright CLI покажет реальное состояние.
- **[Расширение PO влияет на integration-тесты]** → Добавление методов не ломает существующие тесты, т.к. мы только добавляем, не меняем.
