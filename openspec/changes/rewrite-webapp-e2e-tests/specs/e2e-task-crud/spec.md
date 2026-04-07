## ADDED Requirements

### Requirement: Архитектура e2e-тестов Task CRUD на POM + Step pattern
Все e2e-тесты Task CRUD SHALL быть реализованы через Page Object Model с Step-методами, каждый из которых оканчивается явным `expect(...)` ассершном. Тело `test(...)` SHALL содержать только вызовы Step-методов Page Object и обёртки `test.step(...)`.

#### Scenario: Step toggleTask верифицирует перемещение задачи
- **WHEN** метод Page Object переключает чекбокс задачи (`clickTaskCheckbox` или аналогичный)
- **THEN** метод SHALL дождаться визуального эффекта (перемещение в Completed / возврат в Pending) через `expect(...)` внутри самого метода — тест не должен добавлять эти проверки руками

#### Scenario: Валидатор POM проходит
- **WHEN** выполняется `bash .claude/skills/playwright-page-object/scripts/validate.sh webapp/tests`
- **THEN** скрипт SHALL завершиться статусом PASS для файла `task-crud.spec.ts` и использованных Page Objects

### Requirement: Сценарии Task CRUD соответствуют docs/user_stories.md
Файл `webapp/tests/e2e/task-crud.spec.ts` SHALL содержать ровно 4 test-блока, по одному на каждый TC-T-* из `docs/user_stories.md`, с именами тестов, начинающимися с идентификатора кейса.

#### Scenario: Активные кейсы TC-T-01…TC-T-03 реализованы
- **WHEN** запускается `npm run test:e2e` из `webapp/`
- **THEN** тесты `TC-T-01` (создание списка с задачами), `TC-T-02` (toggle в Completed), `TC-T-03` (toggle обратно в Pending) SHALL выполниться и пройти

#### Scenario: Кейс TC-T-04 (переименование задачи) помечен test.skip
- **WHEN** в файле присутствует кейс `TC-T-04`
- **THEN** он SHALL быть помечен `test.skip(...)` с комментарием о причине (кнопка `task-edit-*` есть в DOM, но без onClick-обработчика) и ссылкой на `docs/user_stories.md`

### Requirement: Счётчик прогресса проверяется в toggle-тестах
В каждом активном тесте toggle-перехода (TC-T-02 и TC-T-03) SHALL выполняться проверка счётчика прогресса через Step-метод `verifyProgressCounter(done, total)` после смены статуса задачи.

#### Scenario: После toggle в Completed счётчик показывает 1/1
- **WHEN** в тесте TC-T-02 задача переходит в Completed
- **THEN** SHALL быть вызван `progressView.verifyProgressCounter(1, 1)` и эта проверка SHALL пройти

#### Scenario: После возврата задачи в Pending счётчик показывает 0/1
- **WHEN** в тесте TC-T-03 задача возвращается в Pending
- **THEN** SHALL быть вызван `progressView.verifyProgressCounter(0, 1)` и эта проверка SHALL пройти
