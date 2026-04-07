## ADDED Requirements

### Requirement: App SHALL display My Lists screen as the default screen
The application SHALL show the My Lists screen when launched, displaying a list of task list cards sorted by creation date (newest first).

#### Scenario: App launch with existing lists
- **WHEN** the app launches and task lists exist
- **THEN** the My Lists screen is displayed with cards sorted newest first

#### Scenario: App launch with no data
- **WHEN** the app launches and no task lists exist
- **THEN** the My Lists screen shows an empty state with a "Create First List" button

### Requirement: My Lists screen SHALL display Progress Overview widget
The My Lists screen SHALL include a collapsible Progress Overview widget at the top showing a bar chart of task completion for recent days.

#### Scenario: Progress widget displayed
- **WHEN** the My Lists screen is shown with existing task lists
- **THEN** a Progress Overview bar chart is visible showing completion data for recent days

#### Scenario: Progress widget collapse
- **WHEN** the user taps the Progress Overview widget header
- **THEN** the bar chart section collapses/expands

### Requirement: My Lists screen SHALL display task list cards
Each task list card SHALL show the list name, task count, completion percentage, and a category label. Cards use surface-container-lowest background with rounded corners.

#### Scenario: Task list card content
- **WHEN** a task list exists with name "Weekly Groceries" and 15 items
- **THEN** the card displays "Weekly Groceries", "15 items", and completion status

### Requirement: My Lists screen SHALL have a New button
The My Lists screen SHALL display a "+ New" FAB/button that navigates to the Create New List screen.

#### Scenario: Navigate to create list
- **WHEN** the user taps the "+ New" button
- **THEN** the Create New List screen is displayed

### Requirement: My Lists screen SHALL have bottom navigation
The My Lists screen SHALL display a bottom navigation bar with "My Lists" and "Settings" tabs.

#### Scenario: Bottom nav displayed
- **WHEN** any screen is shown
- **THEN** a bottom navigation bar is visible with My Lists and Settings tabs

### Requirement: Create New List screen SHALL allow creating a task list
The Create New List screen SHALL have a text field for the list name, a dynamic list of task items with checkboxes, an "+ Add task" button, and a "Save List" button.

#### Scenario: Enter list name
- **WHEN** the user opens Create New List screen
- **THEN** a text field with placeholder "e.g., Morning Routine" is displayed under "LIST NAME" label

#### Scenario: Add tasks
- **WHEN** the user types a task name and taps "+ Add task"
- **THEN** a new task input row is added to the tasks list

#### Scenario: Save list
- **WHEN** the user enters a list name, adds tasks, and taps "Save List"
- **THEN** a new task list is created and the user is navigated back to My Lists screen

#### Scenario: Save list validation
- **WHEN** the user taps "Save List" with an empty list name
- **THEN** the list is NOT saved and the name field is highlighted

### Requirement: Progress View screen SHALL display task details
The Progress View screen SHALL show the list title, date, completion percentage with progress bar, current velocity, and estimated completion time.

#### Scenario: Progress header displayed
- **WHEN** the user opens a task list in Progress View
- **THEN** the screen shows the list name, date, completion percentage, and a progress bar

### Requirement: Progress View screen SHALL split tasks into Pending and Completed sections
Tasks SHALL be divided into "Pending" and "Completed" sections with counts displayed.

#### Scenario: Tasks split into sections
- **WHEN** a task list has 2 completed and 4 pending tasks
- **THEN** "Pending 4" and "Completed 2" section headers are shown with tasks under each

### Requirement: Progress View screen SHALL allow toggling task completion
Tapping a task's checkbox SHALL toggle its completion status, moving it between Pending and Completed sections.

#### Scenario: Complete a task
- **WHEN** the user taps the checkbox of a pending task
- **THEN** the task is marked as completed, text is struck through, and it moves to the Completed section

#### Scenario: Uncomplete a task
- **WHEN** the user taps the checkbox of a completed task
- **THEN** the task is marked as pending and moves to the Pending section

### Requirement: Progress View screen SHALL have a Back button
The Progress View screen SHALL display a "Back" button in the header that navigates to My Lists.

#### Scenario: Navigate back
- **WHEN** the user taps the "Back" button on Progress View
- **THEN** the My Lists screen is displayed

### Requirement: Progress View screen SHALL display motivational banner
The Progress View screen SHALL show a motivational banner when tasks are being completed.

#### Scenario: Motivational banner shown
- **WHEN** the user has completed tasks in the current session
- **THEN** a motivational banner is displayed at the bottom (e.g., "Keep the momentum!")

### Requirement: Navigation between screens SHALL work correctly
The app SHALL support navigation: My Lists → Create New List, My Lists → Progress View, and back.

#### Scenario: Navigate to Progress View
- **WHEN** the user taps on a task list card on My Lists screen
- **THEN** the Progress View for that list is displayed

#### Scenario: Navigate from Create List back to My Lists
- **WHEN** the user saves a list or navigates back from Create New List
- **THEN** the My Lists screen is displayed with the updated list

### Requirement: App SHALL use DailyDo Material3 theme
The app SHALL apply a custom Material3 theme with primary color #5700E1, secondary #006E28, rounded shapes, and the Stitch design system's surface hierarchy.

#### Scenario: Theme applied
- **WHEN** the app renders any screen
- **THEN** the primary color is violet (#5700E1), buttons use gradient fill, and components have rounded corners (8-16dp)
