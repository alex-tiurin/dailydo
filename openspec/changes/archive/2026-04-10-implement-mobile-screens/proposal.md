## Why

Мобильное приложение DailyDo содержит только шаблонный экран Compose Multiplatform ("Click me!"). Необходимо реализовать все три основных экрана (My Lists, Create New List, Progress View) с навигацией, network-слоем для работы с существующим backend и тестами, чтобы приложение стало функциональным трекером задач на Android и iOS.

## What Changes

- Реализация экрана **My Lists** — список карточек задач по дням, сворачиваемый виджет Progress Overview (bar chart), empty state, FAB "+ New", bottom navigation (My Lists / Settings)
- Реализация экрана **Create New List** — форма с названием списка, динамический список задач с чекбоксами, кнопка "+ Add task", кнопка "Save List"
- Реализация экрана **Progress View** — заголовок с кнопкой "Back" и счётчиком выполненных, прогресс-бар с процентом, секции Pending/Completed, перемещение задач при клике на checkbox, кнопка редактирования (карандаш), мотивационный баннер
- Кастомная **Material3 тема** по дизайну из Stitch (фирменный фиолетовый #5700E1 / #7033FF, зелёный secondary #006E28, скруглённые компоненты, градиентные кнопки)
- **Навигация** между экранами (state-based через sealed class)
- **Network layer** — Ktor HttpClient в commonMain с платформенными engine (OkHttp для Android, Darwin для iOS), подключение к существующему Fastify backend по REST API контракту
- **Kotlin модели 1:1 с backend** — `@Serializable` data classes с теми же именами полей что в backend (`name`, `done`, `date`)
- **Unit-тесты** с Ktor MockEngine для бизнес-логики и сетевых вызовов
- **UI-тесты для Android** через Assertum MCP (навигация между экранами, создание списка, toggle задач)

## Capabilities

### New Capabilities
- `mobile-screens`: Реализация трёх основных экранов приложения (My Lists, Create New List, Progress View) в Compose Multiplatform с навигацией и Material3 темой
- `mobile-data-model`: Kotlin data classes 1:1 с backend (Task, TaskList, CreateListRequest, UpdateTaskRequest) с `@Serializable`, ViewModel с async-операциями через ApiClient
- `mobile-network`: Ktor HttpClient в commonMain (OkHttp engine для Android, Darwin для iOS), DailyDoApiClient реализующий REST API контракт (`/api/lists`, `/api/lists/:id`, `/api/lists/:id/tasks/:taskId`)
- `mobile-unit-tests`: Unit-тесты с Ktor MockEngine для ViewModel и ApiClient
- `mobile-ui-tests`: Android UI-тесты через Assertum MCP (e2e сценарии на эмуляторе с adb forward портов)

### Modified Capabilities
_(нет изменений существующих спецификаций)_

## Impact

- **Платформа**: Mobile (Android + iOS через commonMain, platform-specific Ktor engines)
- **Код**: Полная замена `App.kt` (шаблонный код → реальное приложение), новые файлы экранов, темы, модели, network, навигации в `composeApp/src/commonMain/`
- **Зависимости**: Ktor Client (core, content-negotiation, serialization-json, okhttp, darwin), kotlinx-serialization-json, плагин kotlin-serialization в `build.gradle.kts` и `libs.versions.toml`
- **Backend**: Приложение подключается к существующему Fastify backend на `localhost:3001` — backend должен быть запущен
- **Тесты**: Unit-тесты в `commonTest` с MockEngine, UI-тесты для Android через Assertum
- **Инфраструктура**: Для UI-тестов — Android-эмулятор + `adb forward` портов для Assertum MCP; для работы приложения — запущенный backend + docker-compose (PostgreSQL)
