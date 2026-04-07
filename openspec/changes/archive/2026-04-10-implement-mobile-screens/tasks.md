## 1. Dependencies & Build Setup

- [x] 1.1 Add Ktor versions and libraries to `gradle/libs.versions.toml` (ktor ~3.1.x: client-core, client-content-negotiation, client-okhttp, client-darwin, client-mock, serialization-kotlinx-json)
- [x] 1.2 Add kotlinx-serialization-json to `libs.versions.toml`
- [x] 1.3 Add `kotlin("plugin.serialization")` plugin to `composeApp/build.gradle.kts`
- [x] 1.4 Add Ktor commonMain dependencies, androidMain (okhttp engine), iosMain (darwin engine), commonTest (mock engine) to `build.gradle.kts`
- [x] 1.5 Verify build: `./gradlew :composeApp:assembleDebug`

## 2. Data Model

- [x] 2.1 Create `model/Task.kt` — `@Serializable data class Task(id, name, done)` matching backend 1:1
- [x] 2.2 Create `model/TaskList.kt` — `@Serializable data class TaskList(id, name, date, tasks)` matching backend 1:1
- [x] 2.3 Create `model/ApiModels.kt` — `CreateListRequest`, `TaskName`, `UpdateTaskRequest` with `@Serializable`

## 3. Network Layer

- [x] 3.1 Create `network/DailyDoApiClient.kt` in commonMain — constructor takes HttpClient and baseUrl
- [x] 3.2 Implement getLists(): List<TaskList> — GET /api/lists
- [x] 3.3 Implement getList(id): TaskList — GET /api/lists/:id
- [x] 3.4 Implement createList(request): TaskList — POST /api/lists
- [x] 3.5 Implement updateTask(listId, taskId, request): Task — PATCH /api/lists/:id/tasks/:taskId
- [x] 3.6 Implement deleteList(id) — DELETE /api/lists/:id
- [x] 3.7 Implement updateList(id, name): TaskList — PUT /api/lists/:id
- [x] 3.8 Create expect/actual for HttpClient engine — `HttpEngine.kt` in androidMain (OkHttp) and iosMain (Darwin)
- [x] 3.9 Configure HttpClient with ContentNegotiation + kotlinx.serialization.json (ignoreUnknownKeys=true)

## 4. Theme

- [x] 4.1 Create `ui/theme/DailyDoTheme.kt` with Material3 ColorScheme (primary #5700E1, secondary #006E28, surfaces from Stitch), Shapes, and Typography

## 5. ViewModel

- [x] 5.1 Create `viewmodel/TaskListViewModel.kt` with state: taskLists, currentScreen, isLoading, error
- [x] 5.2 Create sealed class `Screen` (MyLists, CreateList, ProgressView) for navigation state
- [x] 5.3 Implement loadLists() — calls apiClient.getLists() in viewModelScope, updates state
- [x] 5.4 Implement createTaskList(name, taskNames) — calls apiClient.createList(), adds to state
- [x] 5.5 Implement toggleTask(listId, taskId) — calls apiClient.updateTask() with toggled done, updates state
- [x] 5.6 Implement editTask(listId, taskId, newName) — calls apiClient.updateTask() with new name
- [x] 5.7 Implement deleteTaskList(listId) — calls apiClient.deleteList(), removes from state
- [x] 5.8 Implement navigation methods (navigateToCreate, navigateToProgress, navigateBack)
- [x] 5.9 Implement computed properties: completedCount, totalCount, completionPercentage per list

## 6. UI Components

- [x] 6.1 Create `ui/component/BottomNavBar.kt` — bottom navigation with My Lists and Settings tabs
- [x] 6.2 Create `ui/component/TaskCard.kt` — task list card (name, task count, completion %, date)
- [x] 6.3 Create `ui/component/ProgressChart.kt` — bar chart widget for Progress Overview
- [x] 6.4 Create `ui/component/TaskItem.kt` — task row with checkbox, name, edit button, strikethrough for completed

## 7. Screens

- [x] 7.1 Create `ui/screen/MyListsScreen.kt` — header with "+ New" button, collapsible Progress Overview, list of TaskCards, empty state, loading/error states
- [x] 7.2 Create `ui/screen/CreateListScreen.kt` — list name field, dynamic task list with "+ Add task", "Save List" button with validation
- [x] 7.3 Create `ui/screen/ProgressScreen.kt` — back button, completion stats, progress bar, Pending/Completed sections, motivational banner

## 8. App Integration

- [x] 8.1 Refactor `App.kt` — wrap in DailyDoTheme, create HttpClient with platform engine, create ApiClient, create ViewModel, implement navigation via when(currentScreen)
- [x] 8.2 Verify build compiles for Android: `./gradlew :composeApp:assembleDebug`
- [x] 8.3 Verify build compiles for iOS: check commonMain has no Android-specific imports

## 9. Repository Pattern

- [x] 9.1 Create `repository/TaskRepository.kt` — интерфейс с suspend-методами: getLists, getList, createList, setTaskDone(listId, taskId, done), renameTask(listId, taskId, name), deleteList
- [x] 9.2 Create `data/KtorTaskRepository.kt` — реализация, делегирующая в DailyDoApiClient
- [x] 9.3 Update `TaskListViewModel.kt` — принимает TaskRepository вместо DailyDoApiClient; toggleTask передаёт `done = !task.done` в `repository.setTaskDone`
- [x] 9.4 Update `App.kt` — создаёт KtorTaskRepository(apiClient) и передаёт в ViewModel
- [x] 9.5 Create `commonTest/FakeTaskRepository.kt` — in-memory реализация с `shouldThrow: Boolean` для тестирования ошибок

## 10. Unit Tests

- [x] 10.1 Create test file in commonTest for DailyDoApiClient with MockEngine
- [x] 10.2 Test: getLists() parses response correctly
- [x] 10.3 Test: createList() sends correct request body
- [x] 10.4 Test: updateTask() sends correct PATCH request (toggle done, edit name)
- [x] 10.5 Test: deleteList() sends DELETE request
- [x] 10.6 Test: API error handling (404, 500)
- [x] 10.7 Rewrite `TaskListViewModelTest.kt` — использует FakeTaskRepository (без Ktor/MockEngine)
- [x] 10.8 Test: ViewModel loads lists on init
- [x] 10.9 Test: ViewModel handles load error (FakeTaskRepository.shouldThrow = true)
- [x] 10.10 Test: toggleTask передаёт правильный done в Repository и обновляет state
- [x] 10.11 Test: completion percentage calculation (0%, 50%, 100%)
- [x] 10.12 Test: createTaskList добавляет список в state
- [x] 10.13 Test: deleteTaskList удаляет список из state
- [x] 10.14 Test: navigation state transitions
- [x] 10.15 Run all tests: `./gradlew :composeApp:allTests`

## 11. Android UI Tests (Assertum MCP)

- [x] 11.1 Setup: start backend (docker-compose up + npm start in backend/)
- [x] 11.2 Verify build compiles: `./gradlew :composeApp:assembleDebug`
- [x] 11.3 Setup: configure `adb forward` for Assertum MCP port
- [x] 11.4 Setup: use Assertum MCP `assertum_restart_test` to deploy and launch the app on emulator
- [x] 11.5 E2E test: empty state → create first list → verify list appears on My Lists
- [x] 11.6 E2E test: navigate to Progress View → toggle task → verify section change and percentage update
- [x] 11.7 E2E test: navigation flow — My Lists → Create List → back → tap card → Progress View → back
