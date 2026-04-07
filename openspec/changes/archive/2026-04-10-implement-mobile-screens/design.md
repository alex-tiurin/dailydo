## Context

Приложение DailyDo — ежедневный трекер задач на Compose Multiplatform (Android + iOS). Сейчас `App.kt` содержит шаблонный код ("Click me!"). Необходимо реализовать полноценное приложение с тремя экранами, network-слоем к существующему Fastify backend и тестами.

Дизайн определён в Stitch (проект DailyDo, ID 17199200639276686324) — 7 экранов для мобильной версии (light + dark). Ключевые визуальные решения: фиолетовый primary (#5700E1/#7033FF), зелёный secondary (#006E28), скруглённые компоненты, градиентные CTA-кнопки, "no-line" принцип (без 1px разделителей).

Backend уже реализован: Fastify + PostgreSQL, REST API на `localhost:3001`. Контракт описан в `openspec/specs/api-contract/spec.md`. Типы: `Task {id, name, done}`, `TaskList {id, name, date, tasks}`.

Стек: Kotlin 2.3.0, Compose Multiplatform 1.10.0, Material3. Весь UI и бизнес-логика — в `commonMain`. lifecycle-viewmodel уже подключён.

## Goals / Non-Goals

**Goals:**
- Реализовать три экрана (My Lists, Create New List, Progress View) в commonMain
- Применить дизайн-систему из Stitch как Material3 тему
- Реализовать network layer через Ktor HttpClient для работы с существующим backend
- Kotlin-модели 1:1 с backend (одинаковые имена полей в JSON)
- ViewModel напрямую вызывает ApiClient (без Repository)
- Unit-тесты с Ktor MockEngine
- UI-тесты для Android через Assertum MCP

**Non-Goals:**
- Тёмная тема (пока только светлая, dark mode — отдельная итерация)
- Persistence / offline mode (Room/DataStore) — данные только с сервера
- Repository pattern — ViewModel → ApiClient напрямую
- Экран Settings (bottom nav показывает иконку, но экран не реализуется)
- iOS-специфичный код — всё через commonMain (кроме Ktor engine)

## Decisions

### 1. Навигация: State-based вместо Navigation Compose

**Решение**: Использовать sealed class `Screen` + `mutableStateOf` в ViewModel для навигации.

**Альтернатива**: `navigation-compose` — потребует дополнительной зависимости, KMP-совместимой версии, конфигурации NavHost. Для 3 экранов это overengineering.

**Обоснование**: Минимум зависимостей, полный контроль, lifecycle-viewmodel уже подключён. Навигация через `when (currentScreen)` в `App()`.

### 2. Архитектура: ViewModel → ApiClient (без Repository)

**Решение**: Один `TaskListViewModel` в commonMain напрямую вызывает `DailyDoApiClient`. Нет промежуточного Repository-слоя.

**Альтернатива**: Repository pattern (interface + impl) — избыточно без offline/кэширования. MockEngine покрывает потребности тестирования.

**Обоснование**: Все данные приходят с сервера, нет локального хранилища, нет необходимости абстрагировать источник данных. ViewModel использует `viewModelScope.launch` для async вызовов, хранит UI state (loading/error/success).

### 3. Модель данных: 1:1 с backend, @Serializable

**Решение**:
```kotlin
@Serializable
data class Task(val id: String, val name: String, val done: Boolean = false)

@Serializable
data class TaskList(val id: String, val name: String, val date: String, val tasks: List<Task>)

@Serializable
data class CreateListRequest(val name: String, val tasks: List<TaskName>)

@Serializable
data class TaskName(val name: String)

@Serializable
data class UpdateTaskRequest(val done: Boolean? = null, val name: String? = null)
```

**Альтернатива**: Собственные имена полей с `@SerialName` маппингом — лишний слой трансляции.

**Обоснование**: Backend уже определяет контракт. Kotlin-модели повторяют структуру 1:1 — `name` (не `title`), `done` (не `isCompleted`), `date` как String ISO (не Long). Нет маппинга, нет ошибок трансляции.

### 4. Network: Ktor HttpClient с платформенными engine

**Решение**:
- `commonMain`: `ktor-client-core`, `ktor-client-content-negotiation`, `ktor-serialization-kotlinx-json`
- `androidMain`: `ktor-client-okhttp`
- `iosMain`: `ktor-client-darwin`
- `commonTest`: `ktor-client-mock` (MockEngine)

`DailyDoApiClient` принимает `HttpClient` через конструктор (удобно для тестов с MockEngine).

**Альтернатива**: Retrofit/OkHttp — только Android, не KMP-совместимые.

**Обоснование**: Ktor — единственная production-ready HTTP-библиотека для Kotlin Multiplatform. Engine per platform — стандартный подход.

### 5. Тема: Кастомный Material3 ColorScheme

**Решение**: Определить `DailyDoTheme` с цветами из Stitch дизайн-системы:
- Primary: #5700E1, PrimaryContainer: #7033FF
- Secondary: #006E28, SecondaryContainer: #6FFB85
- Background: #F9F9F9, Surface: #F9F9F9
- Скруглённые Shapes (8dp-16dp)

**Обоснование**: Material3 ColorScheme напрямую маппится на цвета из Stitch. Gradient для CTA-кнопок реализуется через `Brush.linearGradient` в Modifier.

### 6. UI-тесты: Assertum MCP на Android-эмуляторе

**Решение**: UI-тесты через Assertum MCP с подключением к эмулятору через `adb forward`.

**Обоснование**: Assertum позволяет писать e2e тесты декларативно через MCP, без инструментальных тестов. Требует запущенного эмулятора и `adb forward tcp:port tcp:port` для связи MCP-сервера с устройством.

### 7. Структура файлов

```
composeApp/src/commonMain/kotlin/com/atiurin/dailydo/
├── App.kt                    # Точка входа, навигация, тема
├── model/
│   ├── Task.kt               # @Serializable data class Task (1:1 с backend)
│   ├── TaskList.kt           # @Serializable data class TaskList
│   └── ApiModels.kt          # CreateListRequest, UpdateTaskRequest
├── network/
│   └── DailyDoApiClient.kt   # Ktor HttpClient, все REST-вызовы
├── viewmodel/
│   └── TaskListViewModel.kt  # Единый ViewModel, async через viewModelScope
├── ui/
│   ├── theme/
│   │   └── DailyDoTheme.kt   # Material3 тема + цвета
│   ├── screen/
│   │   ├── MyListsScreen.kt      # Главный экран
│   │   ├── CreateListScreen.kt   # Создание списка
│   │   └── ProgressScreen.kt     # Просмотр/редактирование
│   └── component/
│       ├── ProgressChart.kt      # Bar chart виджет
│       ├── TaskCard.kt           # Карточка списка
│       ├── TaskItem.kt           # Элемент задачи с checkbox
│       └── BottomNavBar.kt       # Нижняя навигация

composeApp/src/androidMain/kotlin/com/atiurin/dailydo/
└── di/
    └── HttpEngine.android.kt    # expect/actual для OkHttp engine

composeApp/src/iosMain/kotlin/com/atiurin/dailydo/
└── di/
    └── HttpEngine.ios.kt        # expect/actual для Darwin engine
```

## Risks / Trade-offs

**[Нет offline mode]** → Приложение не работает без сервера. Митигация: осознанное решение для MVP, при необходимости — добавить Repository + Room/DataStore.

**[Нет Repository]** → ViewModel напрямую зависит от ApiClient. Митигация: MockEngine покрывает тестирование; при добавлении offline — ввести Repository интерфейс.

**[Single ViewModel]** → При росте приложения может стать God Object. Митигация: при добавлении экранов/фич — разделить на domain-specific ViewModels.

**[State-based навигация]** → Нет поддержки deep links и back stack из коробки. Митигация: ручной back stack через `List<Screen>`. Достаточно для 3 экранов.

**[Backend должен быть запущен]** → Для работы приложения нужен `docker-compose up` + `npm start`. Митигация: документировать setup, для UI-тестов — обязательное предусловие.

**[Assertum UI-тесты зависят от эмулятора]** → Тесты не запустятся без эмулятора и adb forward. Митигация: документировать setup, использовать конкретный порт.
