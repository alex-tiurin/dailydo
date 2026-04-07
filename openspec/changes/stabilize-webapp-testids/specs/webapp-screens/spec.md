## MODIFIED Requirements

### Requirement: All interactive elements have data-testid
Every interactive element (buttons, links, checkboxes, inputs, cards) and key content containers SHALL have a stable `data-testid` attribute for Playwright test targeting. Test IDs for repeated list/task entities MUST NOT include runtime IDs. Repeated entities SHALL be disambiguated by visible text and/or `aria-label`.

#### Scenario: Testid on primary actions
- **WHEN** the My Lists screen renders
- **THEN** the "+ New List" button SHALL have `data-testid="new-list-button"`

#### Scenario: Stable testid on day cards
- **WHEN** a list day card renders on My Lists
- **THEN** the card container SHALL have `data-testid="day-card"` and an `aria-label` derived from the list name

#### Scenario: Stable testid on day card progress
- **WHEN** a list day card renders on My Lists
- **THEN** its progress element SHALL have `data-testid="day-card-progress"` without an ID suffix

#### Scenario: Stable testid on task row controls
- **WHEN** a task item renders in Progress View
- **THEN** the row SHALL have `data-testid="task-item"` with an `aria-label` derived from task name, and child controls SHALL use stable IDs (`task-checkbox`, `task-name`, `task-edit`) with semantic labels for toggle/edit actions
