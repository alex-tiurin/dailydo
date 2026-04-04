## 1. Исследовательское тестирование (Playwright CLI)

- [x] 1.1 Запустить webapp (`npm run dev` в `webapp/`) и backend, убедиться что приложение доступно на `http://localhost:3000`
- [x] 1.2 Запустить `playwright codegen http://localhost:3000` в директории `webapp/` и исследовать экран My Lists
- [x] 1.3 Исследовать экран Create New List: добавление задач, сохранение, валидация пустого имени
- [x] 1.4 Исследовать экран Progress View: toggle задачи, кнопка Back, кнопка `task-edit-*`
- [x] 1.5 Задокументировать в комментарии к тестам: есть ли кнопка удаления списка в UI, реализовано ли инлайн-редактирование задачи

## 2. Расширение существующих Page Objects

- [x] 2.1 Добавить в `MyListsPage.ts`: `deleteList(listId)`, `verifyListDeleted(listId)`, `clickEditIcon(listId)` (если кнопка редактирования есть на карточке)
- [x] 2.2 Добавить в `ProgressViewPage.ts`: `verifyTaskInPendingSection(taskId)`, `verifyTaskInCompletedSection(taskId)`, `clickEditTask(taskId)`, `renameTask(taskId, name)`, `verifyTaskName(taskId, name)`

## 3. E2e-тесты навигации

- [x] 3.1 Создать `tests/e2e/navigation.spec.ts` — тест: My Lists → Create (кнопка "+ New List") → My Lists (после сохранения)
- [x] 3.2 Добавить тест: My Lists → Progress View (клик по карточке) → My Lists (кнопка Back)
- [x] 3.3 Добавить тест: полный цикл `/` → `/create` → `/` → `/list/:id` → `/`
- [x] 3.4 Добавить тест: навигация из empty state (Create First List → `/create`)
- [x] 3.5 Все тесты обернуть в `test.step()` согласно PO + Step pattern

## 4. E2e-тесты CRUD задач

- [x] 4.1 Создать `tests/e2e/task-crud.spec.ts` — тест: создание списка с задачами, проверка что задачи видны в Pending
- [x] 4.2 Добавить тест: toggle задачи из Pending → Completed (проверить перемещение и счётчик)
- [x] 4.3 Добавить тест: toggle задачи из Completed → Pending (проверить перемещение)
- [x] 4.4 Добавить тест: редактирование названия задачи — если фича не реализована, тест пометить как `test.skip` с комментарием

## 5. E2e-тесты CRUD списков (дней)

- [x] 5.1 Создать `tests/e2e/list-crud.spec.ts` — тест: создание списка, проверка карточки на главном экране
- [x] 5.2 Добавить тест: создание с пустым именем — проверить что остаёмся на `/create` с ошибкой валидации
- [x] 5.3 ��обавить тест: удаление списка — если кнопка в UI отсутствует, тест пометить как `test.skip` с комментарием о состоянии фичи
- [x] 5.4 Добавить тест: после удаления последнего списка отображается empty state

## 6. Проверка и финализация

- [x] 6.1 Запустить все e2e-тесты: `npx playwright test tests/e2e/` и убедиться что проходят (или падения задокументированы как known issues)
- [x] 6.2 Убедиться что существующие integration-тесты не сломаны: `npx playwright test tests/integration/`
