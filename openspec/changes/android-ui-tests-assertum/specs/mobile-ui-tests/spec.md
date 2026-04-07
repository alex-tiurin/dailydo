## MODIFIED Requirements

### Requirement: UI тесты SHALL использовать Assertum MCP tools для assertions
Все UI тесты SHALL использовать Assertum MCP tools (assertum_screenshot, assertum_assertion, assertum_action, assertum_accessibility_tree, assertum_save_test, assertum_restart_test) для взаимодействия с Android приложением и верификации результатов. Каждый тест SHALL сохраняться через assertum_save_test как финальный шаг.

#### Scenario: Стандартная структура Assertum-теста
- **WHEN** UI тест начинает выполнение
- **THEN** сначала вызывается assertum_restart_test для чистого состояния
- **WHEN** тест выполняет действия и верификации
- **THEN** используются assertum_action для взаимодействия, assertum_assertion для проверок, assertum_screenshot для визуальной верификации
- **WHEN** тест завершает все шаги
- **THEN** assertum_save_test вызывается для сохранения теста

## ADDED Requirements

### Requirement: UI тесты SHALL запускаться последовательно один за другим
5 E2E тестов SHALL выполняться строго последовательно. Каждый следующий тест запускается только после успешного сохранения предыдущего. Порядок: empty_state_create_list → task_toggle_completion → navigation_flow → create_list_multiple_tasks → full_day_workflow.

#### Scenario: Последовательный запуск 5 тестов
- **WHEN** инициируется запуск серии из 5 тестов
- **THEN** тесты выполняются строго в порядке: 1 → 2 → 3 → 4 → 5
- **WHEN** каждый тест завершается
- **THEN** вызывается assertum_save_test перед переходом к следующему тесту
