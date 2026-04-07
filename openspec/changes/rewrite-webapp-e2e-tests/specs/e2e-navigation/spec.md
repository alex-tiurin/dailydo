## ADDED Requirements

### Requirement: Архитектура e2e-тестов навигации на POM + Step pattern
Все e2e-тесты навигации SHALL быть реализованы через Page Object Model с Step-методами, каждый из которых оканчивается явным `expect(...)` ассершном. Тело `test(...)` SHALL содержать только вызовы Step-методов Page Object и обёртки `test.step(...)`.

#### Scenario: Step-метод навигации верифицирует целевой URL
- **WHEN** Page Object выполняет действие, меняющее URL (клик по кнопке навигации, Back, click day card)
- **THEN** метод SHALL завершаться `expect(page).toHaveURL(...)` или `expect(targetPageLocator).toBeVisible()` — без этой проверки метод не считается Step-методом

#### Scenario: Валидатор POM проходит
- **WHEN** выполняется `bash .claude/skills/playwright-page-object/scripts/validate.sh webapp/tests`
- **THEN** скрипт SHALL завершиться статусом PASS для файла `navigation.spec.ts` и использованных Page Objects

### Requirement: Сценарии навигации соответствуют docs/user_stories.md
Файл `webapp/tests/e2e/navigation.spec.ts` SHALL содержать ровно 5 test-блоков, по одному на каждый TC-N-* из `docs/user_stories.md`, с именами тестов, начинающимися с идентификатора кейса.

#### Scenario: Активные кейсы TC-N-01…TC-N-04 реализованы
- **WHEN** запускается `npm run test:e2e` из `webapp/`
- **THEN** тесты `TC-N-01`, `TC-N-02`, `TC-N-03`, `TC-N-04` SHALL выполниться и пройти

#### Scenario: Кейс TC-N-05 (empty state → create) помечен test.skip
- **WHEN** в файле присутствует кейс `TC-N-05`
- **THEN** он SHALL быть помечен `test.skip(...)` с комментарием о причине (in-memory backend не даёт гарантировать empty state без reset-endpoint) и ссылкой на `docs/user_stories.md`

### Requirement: Полный навигационный цикл покрывается одним тестом
Тест `TC-N-04` SHALL проверять сценарий `My Lists → Create → My Lists → Progress View → My Lists` как единый flow, используя фазовые `test.step(...)` для каждой логической стадии.

#### Scenario: Каждая фаза навигационного цикла обёрнута в test.step
- **WHEN** выполняется тест `TC-N-04`
- **THEN** Playwright HTML report SHALL показать не менее 5 именованных шагов (open My Lists, navigate to Create, save and verify, open Progress View, return via Back)
