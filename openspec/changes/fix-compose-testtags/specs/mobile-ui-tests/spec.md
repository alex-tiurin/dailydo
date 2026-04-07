## ADDED Requirements

### Requirement: composeApp UI elements SHALL use role-based testTags
Every Compose element in `composeApp/src/commonMain` that exposes a `testTag` via `Modifier.semantics { testTag = ... }` SHALL use a stable, role‑describing string literal. The `testTag` value MUST NOT embed entity identifiers (`Task.id`, `TaskList.id`, etc.) or positional indices that change when the user edits the list. Uniqueness among elements of the same role SHALL be achieved via user‑controllable semantics (`contentDescription`, or already‑visible `Text`), not via the tag itself.

#### Scenario: TaskCard tag is role-based
- **WHEN** a `TaskCard` is rendered for any `TaskList`
- **THEN** its `testTag` equals the constant `"task_card"` regardless of `taskList.id`

#### Scenario: TaskItem checkbox tag is role-based
- **WHEN** a `TaskItem` is rendered for any `Task`
- **THEN** the checkbox's `testTag` equals the constant `"task_checkbox"` regardless of `task.id`

#### Scenario: CreateListScreen task input tag is role-based
- **WHEN** the user sees N task input rows on `CreateListScreen`
- **THEN** every task input row has `testTag = "task_input"` (no `$index` suffix)

### Requirement: composeApp list items SHALL expose user-controllable semantics for test disambiguation
Any repeating Compose element in `composeApp/src/commonMain` (items of lists, cards, rows) that shares a `testTag` with siblings SHALL additionally expose user‑controllable data in its semantics so an automated UI test can pick one specific instance without knowing internal IDs. User‑controllable data means values the test sets through the UI during the scenario (list name, list date, task name, text typed by the user).

#### Scenario: TaskCard exposes list identity
- **WHEN** a `TaskCard` is rendered for a `TaskList` with `name = "Morning Routine"` and `date = "Sep 23"`
- **THEN** the card exposes `contentDescription` containing both `"Morning Routine"` and `"Sep 23"` so a test can match the card by these values

#### Scenario: TaskItem checkbox exposes task name
- **WHEN** a `TaskItem` is rendered for a `Task` with `name = "Exercise"`
- **THEN** the checkbox exposes `contentDescription = "Exercise"` so a test can find the checkbox for task `"Exercise"` via `hasTestTag("task_checkbox") and hasContentDescription("Exercise")`

#### Scenario: Test can target an item without knowing internal IDs
- **WHEN** an automated UI test creates a list named `"Morning Routine"` with task `"Exercise"`, then tries to toggle that task's checkbox
- **THEN** the test locates the checkbox by `testTag = "task_checkbox"` plus `contentDescription = "Exercise"` without referencing `Task.id` or `TaskList.id`

### Requirement: composeApp LazyColumns SHALL expose a stable container testTag
Every `LazyColumn` in `composeApp/src/commonMain` SHALL carry its own `Modifier.semantics { testTag = ... }` with a stable, screen‑scoped string literal. The container `testTag` MUST be distinct from the `testTag` of any item composable rendered inside it, and MUST NOT embed entity identifiers or positional data. The container tag provides a scope an automated UI test can use to narrow the search for item‑level tags on that specific screen.

#### Scenario: MyListsScreen list container tag
- **WHEN** the `MyListsScreen` renders the list of `TaskCard`s
- **THEN** its `LazyColumn` exposes `testTag = "my_lists_column"`

#### Scenario: CreateListScreen list container tag
- **WHEN** the `CreateListScreen` renders the task‑input rows
- **THEN** its `LazyColumn` exposes `testTag = "create_list_column"`

#### Scenario: ProgressScreen list container tag
- **WHEN** the `ProgressScreen` renders pending and completed tasks
- **THEN** its `LazyColumn` exposes `testTag = "progress_column"`

#### Scenario: Test scopes item search by container tag
- **WHEN** an automated UI test needs to find a `task_card` with `contentDescription` containing `"Morning Routine"` on the main screen
- **THEN** the test first locates `testTag = "my_lists_column"` and searches for the item tag only within that container, so results are not contaminated by elements outside the list (overlays, transitions, other screens)
