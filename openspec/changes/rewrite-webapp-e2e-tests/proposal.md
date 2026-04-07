## Why

Текущие webapp e2e тесты в `webapp/tests/e2e/` были написаны вручную и содержат неконсистентные шаги, локальные вызовы Playwright API внутри `test.step` и расхождения с `docs/user_stories.md` (единого источника пользовательских сценариев). Пересоздание с использованием навыков `playwright-cli` (для рекординга реальных UI-сценариев в работающем приложении) и `playwright-page-object` (для строгого применения POM + Step pattern с встроенными ассершнами) гарантирует, что каждый тест отражает подтверждённый в браузере сценарий и остаётся поддерживаемым при росте UI.

## What Changes

- **Платформа**: только webapp (React / Next.js в `webapp/`). Мобильные и backend тесты не затрагиваются.
- **BREAKING**: полностью заменяются три файла e2e-спецификаций (`list-crud.spec.ts`, `navigation.spec.ts`, `task-crud.spec.ts`) — старый код удаляется, на его место пишутся новые тесты по 13 кейсам из `docs/user_stories.md` (TC-L-01…04, TC-N-01…05, TC-T-01…04).
- Page Objects `MyListsPage`, `CreateListPage`, `ProgressViewPage` приводятся в соответствие с требованиями `playwright-page-object` (каждый шаг заканчивается `expect`, нет raw `page.*` вызовов в тестах, добавляется блок E2e extensions где необходимо).
- Каждый активный сценарий предварительно проходится через `playwright-cli` в запущенном webapp для сбора актуальных локаторов и подтверждения шагов; после этого raw-код рефакторится в Step-методы.
- Пропущенные сценарии (`TC-L-03`, `TC-L-04`, `TC-N-05`, `TC-T-04`) остаются как `test.skip` с той же мотивацией (API готов, UI нет / нет reset-endpoint), но используют унифицированные POM-методы.
- После рефакторинга валидатор `.claude/skills/playwright-page-object/scripts/validate.sh webapp/tests` возвращает PASS.
- Набор прогоняется командой `npm run test:e2e` из `webapp/` и полностью зелёный (9 активных, 4 skipped).

## Capabilities

### New Capabilities

_(нет — работаем с существующими e2e спецификациями)_

### Modified Capabilities

- `e2e-list-crud`: требования к архитектуре теста — POM + Step pattern, валидатор проходит, сценарии соответствуют TC-L-01…04 из `docs/user_stories.md`.
- `e2e-navigation`: то же — POM + Step pattern, сценарии соответствуют TC-N-01…05.
- `e2e-task-crud`: то же — POM + Step pattern, сценарии соответствуют TC-T-01…04.

## Impact

- **Код**: `webapp/tests/e2e/list-crud.spec.ts`, `webapp/tests/e2e/navigation.spec.ts`, `webapp/tests/e2e/task-crud.spec.ts` (полная перезапись); `webapp/tests/page-objects/MyListsPage.ts`, `webapp/tests/page-objects/CreateListPage.ts`, `webapp/tests/page-objects/ProgressViewPage.ts` (адаптация методов под строгий Step pattern).
- **Зависимости**: используется уже установленный `@playwright/test`; требуется доступный CLI `playwright-cli` (или `npx playwright-cli`) для рекординга.
- **Инструменты/скрипты**: `bash .claude/skills/playwright-page-object/scripts/validate.sh webapp/tests` включается в чек-лист ревью.
- **Документация**: `docs/user_stories.md` становится single source of truth для e2e — test-кейсы в `.spec.ts` ссылаются на TC-* идентификаторы в комментариях.
- **Риски**: при рекординге против реального in-memory backend тесты могут оказаться флакими из-за общего состояния между тестами — нужно проектировать уникальные имена списков (timestamp) и независимость тестов друг от друга.
- **Mobile / Backend**: не затрагиваются.
