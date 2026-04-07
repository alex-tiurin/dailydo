## Why

Приложение DailyDo требует покрытия основных пользовательских сценариев автоматизированными E2E тестами на Android. Используя Assertum MCP Server, можно создать 5 ключевых тестов, которые запускаются последовательно и сохраняются как независимые сценарии.

## What Changes

- Создание 5 Android E2E тестов с помощью Assertum MCP Server:
  1. **empty-state-to-create-list** — пустое состояние → создание первого списка → верификация на My Lists
  2. **task-toggle-completion** — переход в Progress View → переключение задачи в выполненную
  3. **navigation-flow** — проверка навигации между всеми экранами (My Lists → Create List → back, My Lists → Progress View → back)
  4. **create-list-with-multiple-tasks** — создание списка с 3+ задачами, проверка счётчика и отображения
  5. **full-day-workflow** — полный рабочий сценарий: создание списка, выполнение всех задач, проверка 100% прогресса
- Каждый тест сохраняется через `assertum_save_test` после записи
- Тесты запускаются последовательно один за другим

## Capabilities

### New Capabilities
- `android-e2e-assertum`: 5 E2E тестов для Android через Assertum MCP Server, покрывающих все основные экраны и сценарии приложения

### Modified Capabilities
- `mobile-ui-tests`: Расширение требований — добавление 5 конкретных тест-сценариев с Assertum MCP, перезапуском и сохранением

## Impact

- **Платформа**: Mobile (Android)
- **Инструмент**: Assertum MCP Server (assertum_screenshot, assertum_action, assertum_assertion, assertum_accessibility_tree, assertum_save_test, assertum_restart_test)
- **Зависимости**: работающий Android эмулятор с adb port forwarding для Assertum MCP
- **Код**: новые тест-сценарии в Assertum, не затрагивают production код приложения
