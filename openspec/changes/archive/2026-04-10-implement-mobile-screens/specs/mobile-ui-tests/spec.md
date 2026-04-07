## ADDED Requirements

### Requirement: UI tests SHALL run on Android emulator via Assertum MCP
All UI tests SHALL execute on a running Android emulator with adb port forwarding configured for Assertum MCP server connectivity.

#### Scenario: Emulator connection setup
- **WHEN** UI tests are initiated
- **THEN** adb forward is executed to map Assertum MCP ports between host and emulator

### Requirement: UI test SHALL verify empty state and list creation flow
An e2e test SHALL verify the full flow: empty state → create list → verify list appears on My Lists.

#### Scenario: Create first list e2e
- **WHEN** the app launches with no data
- **THEN** empty state with "Create First List" is shown
- **WHEN** user taps "Create First List", enters list name "Morning Routine", adds tasks "Exercise" and "Breakfast", taps "Save List"
- **THEN** My Lists screen shows a card "Morning Routine" with 2 items

### Requirement: UI test SHALL verify task toggle in Progress View
An e2e test SHALL verify navigating to Progress View and toggling task completion.

#### Scenario: Toggle task completion e2e
- **WHEN** a task list exists and user taps its card
- **THEN** Progress View opens showing all tasks as Pending
- **WHEN** user taps checkbox on first task
- **THEN** task moves to Completed section and completion percentage updates

### Requirement: UI test SHALL verify navigation between all screens
An e2e test SHALL verify navigation: My Lists → Create List → back, My Lists → Progress View → back.

#### Scenario: Navigation flow e2e
- **WHEN** user taps "+ New" on My Lists
- **THEN** Create New List screen is displayed
- **WHEN** user navigates back
- **THEN** My Lists screen is displayed
- **WHEN** user taps a list card
- **THEN** Progress View is displayed
- **WHEN** user taps "Back"
- **THEN** My Lists screen is displayed

### Requirement: UI test SHALL use Assertum MCP tools for assertions
All UI tests SHALL use Assertum MCP tools (assertum_screenshot, assertum_assertion, assertum_action, assertum_accessibility_tree) for interacting with and verifying the Android app.

#### Scenario: Assertum-based screen verification
- **WHEN** a UI test verifies a screen
- **THEN** it uses assertum_screenshot to capture state and assertum_assertion to verify expected elements are present
