## ADDED Requirements

### Requirement: Unit tests SHALL cover ApiClient with MockEngine
Tests in commonTest SHALL verify DailyDoApiClient using Ktor MockEngine to simulate server responses.

#### Scenario: getLists returns parsed data
- **WHEN** MockEngine returns JSON array with 2 task lists
- **THEN** getLists() returns a List<TaskList> with 2 items

#### Scenario: createList sends correct request
- **WHEN** createList is called with name "Test" and tasks [{"name":"A"}]
- **THEN** MockEngine receives POST /api/lists with correct JSON body

#### Scenario: updateTask sends toggle request
- **WHEN** updateTask is called with done=true
- **THEN** MockEngine receives PATCH with body `{"done":true}`

#### Scenario: API error handling
- **WHEN** MockEngine returns 500
- **THEN** the ApiClient throws an exception

### Requirement: TaskRepository interface SHALL decouple ViewModel from Ktor
A `TaskRepository` interface SHALL exist in commonMain with explicit suspend methods. `KtorTaskRepository` SHALL implement it via `DailyDoApiClient`. `FakeTaskRepository` SHALL exist in commonTest for isolated ViewModel testing.

#### Scenario: Interface defines explicit task operations
- **WHEN** TaskRepository interface is defined
- **THEN** it exposes getLists, getList, createList, setTaskDone, renameTask, deleteList as suspend functions

#### Scenario: KtorTaskRepository delegates to ApiClient
- **WHEN** KtorTaskRepository.getLists() is called
- **THEN** it delegates to DailyDoApiClient.getLists()

#### Scenario: FakeTaskRepository works without Ktor
- **WHEN** FakeTaskRepository is instantiated with a pre-populated list
- **THEN** getLists() returns that list without any HTTP calls

### Requirement: Unit tests SHALL cover ViewModel async operations
Tests SHALL verify that ViewModel correctly loads data from TaskRepository and updates state using FakeTaskRepository (no Ktor/MockEngine).

#### Scenario: ViewModel loads lists on init
- **WHEN** ViewModel is created with a FakeTaskRepository containing 2 lists
- **THEN** taskLists state contains 2 items and isLoading is false

#### Scenario: ViewModel handles load error
- **WHEN** ViewModel is created and FakeTaskRepository is configured to throw
- **THEN** error state is set and taskLists is empty

### Requirement: Unit tests SHALL cover task toggling via Repository
Tests SHALL verify toggling a task calls the Repository and updates local state.

#### Scenario: Toggle uncompleted task
- **WHEN** toggleTask is called on a task with done=false
- **THEN** Repository.setTaskDone is called with done=true and the task in state is updated

#### Scenario: Toggle completed task back
- **WHEN** toggleTask is called on a task with done=true
- **THEN** Repository.setTaskDone is called with done=false and the task in state is updated

### Requirement: Unit tests SHALL cover completion percentage calculation
Tests SHALL verify the completion percentage is computed correctly for various states.

#### Scenario: Partial completion
- **WHEN** a list has 4 tasks and 2 have done=true
- **THEN** completion percentage is 50

#### Scenario: All tasks completed
- **WHEN** all tasks in a list have done=true
- **THEN** completion percentage is 100

#### Scenario: No tasks
- **WHEN** a list has zero tasks
- **THEN** completion percentage is 0

### Requirement: Unit tests SHALL cover task list creation and deletion via Repository
Tests SHALL verify CRUD operations update state correctly.

#### Scenario: Create list updates state
- **WHEN** createTaskList is called and FakeTaskRepository returns the new list
- **THEN** the new list appears at the top of taskLists state

#### Scenario: Delete list removes from state
- **WHEN** deleteTaskList is called with a valid list id
- **THEN** the list is removed from ViewModel state

### Requirement: Unit tests SHALL cover navigation state
Tests SHALL verify navigation state transitions are correct.

#### Scenario: Navigate to create screen
- **WHEN** navigateToCreate is called
- **THEN** currentScreen is CreateList

#### Scenario: Navigate to progress and back
- **WHEN** navigateToProgress is called then navigateBack
- **THEN** currentScreen returns to MyLists
