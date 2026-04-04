## Why

У webapp уже есть integration-тесты с мок-API, но нет e2e-тестов против реального приложения. Исследовательское тестирование через Playwright CLI позволит обнаружить реальные баги навигации и CRUD-операций, которые моки не поймают.

## What Changes

- Исследовательское тестирование webapp с помощью Playwright CLI для выявления текущего состояния UI
- Новый набор e2e-тестов (`tests/e2e/`) с Page Object Model (PO + Step pattern) против живого приложения с реальным backend
- Тесты навигации: вперёд и назад между всеми тремя экранами (My Lists → Create → Progress View → My Lists)
- Тесты CRUD: создание, редактирование и удаление задач и дней (списков)

## Capabilities

### New Capabilities

- `e2e-navigation`: Навигация между всеми экранами webapp (вперёд и назад)
- `e2e-task-crud`: Создание, редактирование и удаление задач внутри дня
- `e2e-list-crud`: Создание и удаление дней (списков задач)

### Modified Capabilities

<!-- Нет изменений в существующих требованиях -->

## Impact

- **web (webapp)**: новые файлы в `webapp/tests/e2e/` — page objects, spec-файлы
- **backend**: тесты используют реальный backend на `http://localhost:3001`, требуется запущенный сервер
- **Зависимости**: Playwright уже установлен (`playwright.config.ts` существует), новых зависимостей не требуется
