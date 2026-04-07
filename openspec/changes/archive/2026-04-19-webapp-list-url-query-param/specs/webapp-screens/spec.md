## MODIFIED Requirements

### Requirement: My Lists screen displays day cards
The main screen at `/` SHALL display a heading "My Lists" with the current date below it, a "+ New List" button (Primary) to the right, and a list of day cards sorted by date descending (newest first).

#### Scenario: Lists are loaded and displayed
- **WHEN** the API returns a non-empty array of lists
- **THEN** each list SHALL render as a card showing: date (Text Secondary), list name (Title Medium), progress counter (e.g. "3/5"), edit icon (pencil, Primary), and a progress bar (Checkbox Done fill / Divider background)

#### Scenario: Navigate to create list
- **WHEN** user clicks the "+ New List" button
- **THEN** the app SHALL navigate to `/create`

#### Scenario: Navigate to progress view
- **WHEN** user clicks on a day card or its edit icon
- **THEN** the app SHALL navigate to `/list?id=<listId>` (the list identifier is passed as the `id` query parameter)

### Requirement: Create New List screen
The `/create` route SHALL display a centered card (Surface background, 12dp radius, light shadow) with heading "Create New List", subtitle "Add a name and tasks for today", a "List Name" text input, a "Tasks" section with checkbox task rows, an "+ Add task" link, and a "Save List" button (Primary, full width).

#### Scenario: Add tasks to new list
- **WHEN** user clicks "+ Add task"
- **THEN** a new empty task row with a checkbox SHALL appear in the Tasks section

#### Scenario: Save list
- **WHEN** user fills in the list name, adds tasks, and clicks "Save List"
- **THEN** the app SHALL send a POST request to `/api/lists` with `{ name, tasks: [{ name }] }` and, on success, navigate to `/list?id=<newListId>` (the Progress View of the freshly created list)

#### Scenario: Save list with no tasks
- **WHEN** user fills in only the list name (all task rows empty) and clicks "Save List"
- **THEN** the app SHALL send a POST request to `/api/lists` with `{ name, tasks: [] }` and navigate to `/list?id=<newListId>`; Progress View SHALL render with empty "Pending 0" and "Completed 0" sections

#### Scenario: Validation prevents empty name
- **WHEN** user clicks "Save List" without entering a list name
- **THEN** the form SHALL NOT submit and SHALL indicate the name is required

### Requirement: Progress View screen
The `/list` route (Progress View) SHALL read the target list identifier from the `id` query parameter (e.g. `/list?id=<listId>`) and display the list detail with a top bar containing "Back" button (left) and "X/Y done" counter + edit icon (right), the list name as heading, date below, and two sections: "Pending" and "Completed".

#### Scenario: Load list by id from query
- **WHEN** user navigates to `/list?id=<listId>` with a known id
- **THEN** the app SHALL render the corresponding list in Progress View

#### Scenario: Missing or unknown id
- **WHEN** user navigates to `/list` without `id`, or with an `id` that does not match any list
- **THEN** the app SHALL redirect to `/`

#### Scenario: Tasks split into sections
- **WHEN** the list loads with tasks
- **THEN** tasks with `done: false` SHALL appear under "Pending N" and tasks with `done: true` SHALL appear under "Completed N"

#### Scenario: Toggle task completion
- **WHEN** user clicks a task's checkbox
- **THEN** the app SHALL send a PATCH request to `/api/lists/:id/tasks/:taskId` with `{ done: !currentDone }` and move the task to the opposite section

#### Scenario: Pending task appearance
- **WHEN** a task has `done: false`
- **THEN** it SHALL display with an outlined checkbox (Primary), normal text (Text Primary), and an edit icon

#### Scenario: Completed task appearance
- **WHEN** a task has `done: true`
- **THEN** it SHALL display with a filled green checkbox (Checkbox Done), strikethrough text (Text Done color), and an edit icon

#### Scenario: Navigate back
- **WHEN** user clicks the "Back" button
- **THEN** the app SHALL navigate to `/`

### Requirement: Navbar present on all screens
The app SHALL display a top navigation bar on every screen with the "DailyDo" logo (Primary color) on the left and a circular user avatar (initials, Primary background) on the right.

#### Scenario: Navbar renders on My Lists
- **WHEN** user navigates to the main page `/`
- **THEN** the navbar SHALL display "DailyDo" logo on the left and user avatar on the right

#### Scenario: Navbar renders on Progress View
- **WHEN** user navigates to `/list?id=<listId>`
- **THEN** the same navbar SHALL be visible at the top
