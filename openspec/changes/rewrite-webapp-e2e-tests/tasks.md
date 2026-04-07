## 1. Подготовка

- [x] 1.1 Убедиться, что `playwright-cli` доступен глобально или через `npx playwright-cli` (проверить `npx --no-install playwright-cli --version` из `webapp/`)
- [x] 1.2 Запустить webapp локально: `cd webapp && npm run dev`, проверить доступность `http://localhost:3000` (обнаружен уже запущенный инстанс PID 84747)
- [x] 1.3 Выполнить baseline-прогон валидатора: `bash .claude/skills/playwright-page-object/scripts/validate.sh webapp/tests` — **PASS**, нарушений нет
- [x] 1.4 Перечитать `docs/user_stories.md` и сверить 13 TC с существующими `.spec.ts` — маппинг 1:1, меняются только заголовки тестов на формат `TC-*: ...`

## 2. Аудит Page Objects

- [x] 2.1 Прочитать `webapp/tests/page-objects/MyListsPage.ts` — все Step-методы с `expect()` (validator PASS)
- [x] 2.2 То же для `CreateListPage.ts` — все методы с `expect()` (validator PASS)
- [x] 2.3 То же для `ProgressViewPage.ts` — `clickTaskCheckbox` имеет слабую проверку (просто `toBeVisible`), нужно усилить через compound e2e-методы
- [x] 2.4 Список правок: добавить compound `toggleTaskToCompleted(taskId)` и `toggleTaskToPending(taskId)` в `ProgressViewPage` (E2e extensions)

## 3. Рекординг активных сценариев через playwright-cli

- [x] 3.1 TC-L-01: smoke-recording через `playwright-cli` — подтверждены `data-testid`: `new-list-button`, `list-name-input`, `save-list-button`; переход `/` → `/create` работает
- [x] 3.2 TC-L-02: валидация пустого имени — проверяется через текст «List name is required» (строка в `MyListsPage.verifyValidationError`, уже присутствует в коде)
- [x] 3.3 TC-N-01: переход `new-list-button` → `/create` подтверждён в ходе 3.1
- [x] 3.4 TC-N-02: клик по `day-card-{id}` → `/list/{id}` — локатор подтверждён в существующем `MyListsPage.clickDayCard`, прогон существующих тестов зелёный
- [x] 3.5 TC-N-03: `back-button` → `/` — в `ProgressViewPage.clickBackButton` уже есть `expect(page).toHaveURL('/')`
- [x] 3.6 TC-N-04: цикл покрывается вызовами уже подтверждённых Step-методов
- [x] 3.7 TC-T-01: цепочка создания списка с задачами использует `task-form-input`, подтверждён в 3.1
- [x] 3.8 TC-T-02: `task-checkbox-{id}` и `progress-counter` — локаторы в `ProgressViewPage`, валидатор PASS
- [x] 3.9 TC-T-03: двойной toggle — те же локаторы, логика проверяется через новые compound-методы (см. 2.4)
- [x] 3.10 Браузер CLI закрыт (`playwright-cli close`); новых `data-testid` не обнаружено — существующие корректны

## 4. Обновление Page Objects

- [x] 4.1 `MyListsPage.ts` — правок не требуется, все Step-методы корректны
- [x] 4.2 `CreateListPage.ts` — правок не требуется (`submitList` уже проверяет `/`, `verifyValidationError` — видимость текста)
- [x] 4.3 `ProgressViewPage.ts` — добавлены compound методы `toggleTaskToCompleted(taskId)` и `toggleTaskToPending(taskId)` для строгой проверки перемещения
- [x] 4.4 E2e extensions в `MyListsPage` с `dayCardByName` и `verifyDayCardWithNameVisible` уже присутствовали — оставлены
- [x] 4.5 Импорты во всех Page Objects уже `{ type Page, type Locator, expect } from '@playwright/test'`

## 5. Перезапись webapp/tests/e2e/list-crud.spec.ts

- [x] 5.1 Файл `list-crud.spec.ts` переписан с нуля — 2 активных + 2 skip, заголовки `TC-L-01..04`
- [x] 5.2 Только Step-вызовы Page Objects, каждая фаза в `test.step(...)`
- [x] 5.3 Уникальные имена списков через `Date.now()` (с префиксом TC-* в имени)
- [x] 5.4 Над каждым `test.skip` — комментарий с причиной пропуска и ссылкой на `docs/user_stories.md`
- [x] 5.5 `list-crud.spec.ts` — 2 passed, 2 skipped в общем прогоне

## 6. Перезапись webapp/tests/e2e/navigation.spec.ts

- [x] 6.1 Файл переписан — 4 активных (TC-N-01..04) + 1 skip (TC-N-05)
- [x] 6.2 TC-N-04 содержит 5 `test.step(...)` (open / navigate to create / save / open progress / return)
- [x] 6.3 Над `test.skip('TC-N-05: ...')` — комментарий о необходимости reset-endpoint
- [x] 6.4 `navigation.spec.ts` — 4 passed, 1 skipped в общем прогоне

## 7. Перезапись webapp/tests/e2e/task-crud.spec.ts

- [x] 7.1 Файл переписан — 3 активных (TC-T-01..03) + 1 skip (TC-T-04)
- [x] 7.2 В TC-T-02 и TC-T-03 после toggle вызывается `verifyProgressCounter(done, total)`
- [x] 7.3 Над `test.skip('TC-T-04: ...')` — комментарий про отсутствующий onClick у `task-edit-*`
- [x] 7.4 `task-crud.spec.ts` — 3 passed, 1 skipped в общем прогоне

## 8. Валидация и финальный прогон

- [x] 8.1 Валидатор: `PASS — no Page Object / Step pattern violations in webapp/tests`
- [x] 8.2 Правок по валидатору не потребовалось
- [x] 8.3 Полный прогон: **9 passed, 4 skipped, 0 failed** (5.4s)
- [x] 8.4 TC-N-04 содержит ровно 5 `test.step(...)` — подтверждено в отчёте Playwright

## 9. Документация

- [x] 9.1 Все 13 TC-* ID присутствуют в `.spec.ts` (29 ссылок `TC-` в `webapp/tests/e2e/`)
- [x] 9.2 В шапке каждого `.spec.ts` добавлен комментарий `// See docs/user_stories.md — TC-*..TC-*`
- [x] 9.3 `docs/user_stories.md` править не требуется — статусы ✅/⏭️ совпадают с реализацией

## 10. Финализация

- [x] 10.1 Изменены: `webapp/tests/e2e/list-crud.spec.ts`, `webapp/tests/e2e/navigation.spec.ts`, `webapp/tests/e2e/task-crud.spec.ts`, `webapp/tests/page-objects/ProgressViewPage.ts` (добавлены compound методы)
- [x] 10.2 Итог: 9 pass / 4 skip / 0 fail, валидатор PASS
