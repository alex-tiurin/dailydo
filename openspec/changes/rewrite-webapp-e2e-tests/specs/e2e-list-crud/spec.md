## ADDED Requirements

### Requirement: Архитектура e2e-тестов на POM + Step pattern
Все e2e-тесты List CRUD SHALL быть реализованы через Page Object Model с Step-методами, каждый из которых оканчивается явным `expect(...)` ассершном. Тело `test(...)` SHALL содержать только вызовы Step-методов Page Object и обёртки `test.step(...)` — никаких прямых обращений к `page.*` API.

#### Scenario: Тест оперирует только Step-методами
- **WHEN** в `webapp/tests/e2e/list-crud.spec.ts` встречается любая пользовательская операция (клик, ввод, навигация)
- **THEN** она SHALL быть обёрнута в метод Page Object из `webapp/tests/page-objects/`, и этот метод SHALL содержать `expect(...)` проверяющий наблюдаемый результат действия

#### Scenario: Валидатор POM проходит
- **WHEN** выполняется `bash .claude/skills/playwright-page-object/scripts/validate.sh webapp/tests`
- **THEN** скрипт SHALL завершиться статусом PASS для файла `list-crud.spec.ts` и всех использованных Page Objects

### Requirement: Сценарии соответствуют docs/user_stories.md
Файл `webapp/tests/e2e/list-crud.spec.ts` SHALL содержать ровно 4 test-блока, по одному на каждый TC-L-* из `docs/user_stories.md`, с именами тестов, начинающимися с идентификатора кейса.

#### Scenario: Активные кейсы TC-L-01 и TC-L-02 реализованы
- **WHEN** запускается `npm run test:e2e` из `webapp/`
- **THEN** тесты `TC-L-01: creates a new list...` и `TC-L-02: shows validation error...` SHALL выполниться и пройти

#### Scenario: Заблокированные кейсы TC-L-03 и TC-L-04 помечены test.skip
- **WHEN** в файле присутствуют кейсы `TC-L-03` (удаление списка) и `TC-L-04` (empty state после удаления)
- **THEN** они SHALL быть помечены `test.skip(...)` с комментарием, содержащим причину пропуска (отсутствие UI-триггера удаления) и ссылку на `docs/user_stories.md`

### Requirement: Рекординг через playwright-cli перед реализацией
Перед написанием кода активного e2e-теста для List CRUD команда SHALL использовать скилл `playwright-cli` для получения актуальных `data-testid` и подтверждения корректности UI-шагов в запущенном webapp.

#### Scenario: Получение data-testid через playwright-cli
- **WHEN** требуется новый локатор или подтверждение существующего для Page Object
- **THEN** разработчик SHALL выполнить цикл `playwright-cli open http://localhost:3000` → snapshot → `eval "el => el.getAttribute('data-testid')" eN` и задокументировать найденный `data-testid` в соответствующем Page Object

#### Scenario: Изоляция тестов через уникальные имена списков
- **WHEN** активный тест создаёт список
- **THEN** имя списка SHALL включать `Date.now()` (или иной уникальный идентификатор), чтобы тест был независим от общего состояния in-memory backend

## REMOVED Requirements

### Requirement: Исследовательское тестирование через Playwright CLI
**Reason**: Требование ссылается на устаревший инструмент `playwright codegen` и конкретные сценарии исследования UI, которые уже выполнены (результаты зафиксированы в `docs/user_stories.md` как skipped-кейсы TC-L-03 / TC-L-04).
**Migration**: Новое требование «Рекординг через playwright-cli перед реализацией» заменяет его — используйте скилл `playwright-cli` вместо `playwright codegen`. Итоги исследования для List CRUD теперь хранятся в `docs/user_stories.md`.
