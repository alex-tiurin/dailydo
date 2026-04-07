## ADDED Requirements

### Requirement: Task data class SHALL match backend contract
A `@Serializable` data class `Task` SHALL have fields: `id` (String), `name` (String), `done` (Boolean, default false). Field names SHALL match the backend JSON contract exactly.

#### Scenario: Create a new task
- **WHEN** a Task is deserialized from JSON `{"id":"abc","name":"Buy groceries","done":false}`
- **THEN** the task has id "abc", name "Buy groceries", and done is false

### Requirement: TaskList data class SHALL match backend contract
A `@Serializable` data class `TaskList` SHALL have fields: `id` (String), `name` (String), `date` (String, ISO date format "2026-03-27"), `tasks` (List<Task>). Field names SHALL match the backend JSON contract exactly.

#### Scenario: Create a new task list
- **WHEN** a TaskList is deserialized from JSON with name "Morning Routine", date "2026-04-09", and 3 tasks
- **THEN** the list has name "Morning Routine", date "2026-04-09", and 3 tasks

### Requirement: CreateListRequest data class SHALL match backend contract
A `@Serializable` data class `CreateListRequest` SHALL have fields: `name` (String), `tasks` (List of objects with `name` field).

#### Scenario: Serialize create request
- **WHEN** a CreateListRequest is created with name "Daily Tasks" and tasks [{"name":"Task 1"}, {"name":"Task 2"}]
- **THEN** the serialized JSON matches `{"name":"Daily Tasks","tasks":[{"name":"Task 1"},{"name":"Task 2"}]}`

### Requirement: UpdateTaskRequest data class SHALL match backend contract
A `@Serializable` data class `UpdateTaskRequest` SHALL have optional fields: `done` (Boolean?) and `name` (String?).

#### Scenario: Serialize toggle request
- **WHEN** an UpdateTaskRequest is created with done=true and name=null
- **THEN** the serialized JSON contains `{"done":true}` without the name field

### Requirement: ViewModel SHALL load task lists from API on launch
The `TaskListViewModel` SHALL call `DailyDoApiClient.getLists()` when initialized and store the result in observable state.

#### Scenario: Successful load
- **WHEN** the ViewModel is initialized and the API returns 2 task lists
- **THEN** the taskLists state contains 2 items and isLoading is false

#### Scenario: Load error
- **WHEN** the ViewModel is initialized and the API returns an error
- **THEN** the error state is set and taskLists is empty

### Requirement: ViewModel SHALL create task list via API
The `TaskListViewModel` SHALL call `DailyDoApiClient.createList()` and update state with the server response.

#### Scenario: Create task list via ViewModel
- **WHEN** createTaskList is called with name "Daily Tasks" and tasks ["Task 1", "Task 2"]
- **THEN** the API is called with a CreateListRequest and the returned TaskList is added to state

### Requirement: ViewModel SHALL toggle task via API
The `TaskListViewModel` SHALL call `DailyDoApiClient.updateTask()` with the toggled `done` value and update state.

#### Scenario: Toggle task to completed
- **WHEN** toggleTask is called for a task with done=false
- **THEN** the API is called with `{"done":true}` and the task in state is updated

#### Scenario: Toggle task to uncompleted
- **WHEN** toggleTask is called for a task with done=true
- **THEN** the API is called with `{"done":false}` and the task in state is updated

### Requirement: ViewModel SHALL compute completion statistics
The `TaskListViewModel` SHALL provide computed values for completed count, total count, and completion percentage per list.

#### Scenario: Completion percentage calculated
- **WHEN** a task list has 4 tasks with 2 where done=true
- **THEN** completedCount is 2, totalCount is 4, and completionPercentage is 50

#### Scenario: Empty list percentage
- **WHEN** a task list has 0 tasks
- **THEN** completionPercentage is 0

### Requirement: ViewModel SHALL edit task name via API
The `TaskListViewModel` SHALL call `DailyDoApiClient.updateTask()` with the new name and update state.

#### Scenario: Edit task name
- **WHEN** editTask is called with a new name "Updated task"
- **THEN** the API is called with `{"name":"Updated task"}` and the task in state is updated

### Requirement: ViewModel SHALL delete task list via API
The `TaskListViewModel` SHALL call `DailyDoApiClient.deleteList()` and remove the list from state.

#### Scenario: Delete task list
- **WHEN** deleteTaskList is called with a valid list id
- **THEN** the API is called with DELETE and the list is removed from state

### Requirement: ViewModel SHALL maintain navigation state
The `TaskListViewModel` SHALL hold the current screen state and provide methods to navigate between screens.

#### Scenario: Navigate to Progress View
- **WHEN** navigateToProgress is called with a list id
- **THEN** currentScreen changes to ProgressView with the selected list id

#### Scenario: Navigate back
- **WHEN** navigateBack is called
- **THEN** currentScreen returns to MyLists

### Requirement: ViewModel SHALL expose loading and error states
The `TaskListViewModel` SHALL expose `isLoading` (Boolean) and `error` (String?) states for UI to display loading indicators and error messages.

#### Scenario: Loading state during API call
- **WHEN** an API call is in progress
- **THEN** isLoading is true

#### Scenario: Error state on failure
- **WHEN** an API call fails
- **THEN** error contains a descriptive message and isLoading is false
