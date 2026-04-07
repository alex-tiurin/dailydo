## Context

В `webapp/tests/e2e/` сейчас лежат три spec-файла (`list-crud`, `navigation`, `task-crud`), использующие `test.step` и Page Objects из `webapp/tests/page-objects/`. Скилл `playwright-page-object` требует: никаких raw `page.*` вызовов в тестах, каждый Step заканчивается `expect`, есть структурный валидатор `scripts/validate.sh`. Скилл `playwright-cli` позволяет выполнять реальные UI-взаимодействия в запущенном приложении (snapshot → click/fill → snapshot) и получать актуальные локаторы / `data-testid`.

`docs/user_stories.md` — новый single source of truth, собранный в рамках предыдущей задачи: 13 тест-кейсов (9 активных, 4 skipped) с ID вида `TC-L-01`. Тест-кейсы формулируют user story, шаги и ожидаемый результат на языке пользователя — без привязки к локаторам.

Backend — in-memory Next.js API. Сид данных на старте, reset-endpoint отсутствует. Это накладывает ограничения на empty-state сценарии и требует изоляции тестов через уникальные имена.

## Goals / Non-Goals

**Goals:**
- Пересоздать все три `.spec.ts` файла под `webapp/tests/e2e/` с опорой только на TC-* из `docs/user_stories.md`.
- Каждый активный сценарий подтверждён через `playwright-cli` против запущенного webapp (`npm run dev`) — получены актуальные `data-testid` и проверена кликабельность.
- Валидатор `bash .claude/skills/playwright-page-object/scripts/validate.sh webapp/tests` возвращает PASS.
- Комментарий в каждом `test(...)` / `test.skip(...)` ссылается на ID кейса из `docs/user_stories.md` (например, `// TC-L-01`).
- Page Objects приведены к строгому Step pattern: каждый action-метод оканчивается `expect(...)`.

**Non-Goals:**
- Не трогаем integration-тесты в `webapp/tests/integration/` и их моки.
- Не меняем user-facing поведение приложения — никаких правок в `webapp/src`.
- Не добавляем UI для delete list и edit task — skipped кейсы остаются skipped.
- Не добавляем backend reset-endpoint — TC-N-05 остаётся skipped.
- Не пересматриваем существующие requirement-тексты в `openspec/specs/e2e-*/spec.md` — добавляем только архитектурные требования дельтой.

## Decisions

### Решение 1: Использование `playwright-cli` для рекординга, а не `playwright codegen`

Существующий spec `e2e-list-crud` упоминает `playwright codegen`. Мы явно переходим на `playwright-cli` (скилл), потому что он:
- работает в headless/snapshot-режиме, подходит для автоматизированного рекординга моделью;
- предоставляет ref-based локаторы (`e5`, `e12`), которые модель может резолвить через `eval` в `data-testid`;
- не требует графического Inspector.

**Альтернатива:** продолжать использовать `playwright codegen` вручную. Отвергнуто — requires human interaction, не повторяется автоматически.

### Решение 2: Один Page Object на экран, без разделения по контексту (integration vs e2e)

Существующие `MyListsPage.ts`, `CreateListPage.ts`, `ProgressViewPage.ts` используются и в integration, и в e2e. Оставляем так — но секция `// --- E2e extensions ---` отделяет методы, работающие по видимому тексту (например, `dayCardByName(name)`), от методов на `data-testid` c известными ID.

**Альтернатива:** Разделить на `MyListsPage` и `MyListsPageE2e`. Отвергнуто — дублирование локаторов, усложняет поддержку.

### Решение 3: `test.step` — обязателен для e2e, запрещён для integration

Скилл `playwright-page-object` фиксирует это различие. E2e тесты длиннее (5–15 step-вызовов, несколько фаз), и `test.step` дают читаемые отчёты. Integration — 2–5 вызовов, flat-структура.

### Решение 4: Изоляция тестов через timestamp в имени списка

In-memory backend не сбрасывается между тестами. Каждый тест генерирует уникальное имя: `const listName = `TC-L-01 ${Date.now()}``. Это:
- предотвращает коллизии при параллельном прогоне (worker'ы Playwright);
- даёт осмысленные имена в HTML-отчёте (видно, какой кейс создал карточку);
- не требует cleanup после теста (карточки остаются — это приемлемо, т.к. бэкенд in-memory и рестарт сервера всё стирает).

**Альтернатива:** добавить `afterEach` с чисткой через API. Отвергнуто — DELETE endpoint есть, но тогда тесты зависят от него; плюс лишняя точка падения.

### Решение 5: Маппинг TC-* → test(...)

Имя теста в `.spec.ts` — буквальная копия заголовка TC из `docs/user_stories.md`, начинающаяся с ID. Пример: `test('TC-L-01: creates a new list and verifies card appears on My Lists', ...)`. Skipped кейсы: `test.skip('TC-L-03: deletes a list and verifies card disappears', ...)` с комментарием-причиной пропуска над `test.skip`.

**Почему:** один взгляд на отчёт — и видно, какой кейс из user_stories выполнился / пропустился, без лишнего grep по файлам.

### Решение 6: Workflow рекординга (sequence)

Для каждого активного TC повторяется цикл:

```
разработчик → playwright-cli open http://localhost:3000
            → snapshot (получает refs e1..eN)
            → click/fill по refs (шаги из user_stories.md)
            → eval "el => el.getAttribute('data-testid')" eN  (достаёт стабильный локатор)
            → snapshot после каждого действия (подтверждает UI-результат)
            → close

разработчик → обновляет Page Object новыми методами/локаторами (если нужно)
            → пишет test(...) используя только Step-методы Page Object
            → запускает npm run test:e2e локально
            → запускает validate.sh → PASS
```

## Risks / Trade-offs

- **Риск**: рекординг через `playwright-cli` даёт `data-testid`, который может не соответствовать реальному DOM при смене темы / i18n. → **Митигация**: фиксируем `data-testid` как единственный стабильный локатор; текстовые селекторы используются только в E2e extensions для дневных карточек, где имя уникально (timestamp).
- **Риск**: параллельные worker'ы Playwright конкурируют за общий in-memory backend. → **Митигация**: уникальные имена списков (timestamp + Math.random() при необходимости); избегать глобальных assertions типа "всего N карточек".
- **Риск**: skipped-тесты накапливаются и теряют актуальность. → **Митигация**: каждый `test.skip` содержит одну строку причины и дату последней проверки; перечень skipped продублирован в `docs/user_stories.md`.
- **Риск**: валидатор `validate.sh` может падать на существующих моментах в Page Objects (например, методы без `expect`). → **Митигация**: до написания новых тестов один раз прогоняем валидатор на текущем состоянии и фиксируем baseline; нарушения в коде, который мы трогаем, чиним; unrelated pre-existing — фиксируем в репорте.
- **Trade-off**: переход на `playwright-cli` вместо `codegen` удаляет из `e2e-list-crud` сценарий про `playwright codegen` — оставляем его требование «исследовательское тестирование перед написанием», но обновляем инструмент. Это отражено в delta spec.

## Migration Plan

1. Прогнать `validate.sh` → зафиксировать baseline.
2. Запустить webapp локально (`cd webapp && npm run dev`), дождаться готовности на `http://localhost:3000`.
3. Для каждого активного TC из user_stories.md: рекординг через `playwright-cli` → уточнение Page Object → написание теста.
4. Для skipped TC: сразу писать `test.skip` с комментарием, без рекординга.
5. После всех трёх файлов: `npm run test:e2e` (из `webapp/`) → green (9 pass, 4 skip).
6. `validate.sh webapp/tests` → PASS.
7. Удалить старые версии `.spec.ts` (commit замещением).

Rollback: вернуть предыдущие три `.spec.ts` и Page Objects из git history одним коммитом.

## Open Questions

- Есть ли необходимость добавить `playwright.config.ts` опцию `fullyParallel: false` для e2e, чтобы избежать гонок на in-memory backend? — Проверить после первого зелёного прогона; если флейки появляются, включить.
- Нужен ли отдельный `e2e.setup.ts` (Playwright project setup) для старта/прогрева webapp? — Скорее всего нет, `webServer` в config уже делает это.
