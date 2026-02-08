# Data Model: Daily Do Backend

**Feature**: 001-nodejs-server-webapp  
**Date**: 2025-02-07

## Entities

### Day

Represents one "day" (named unit of work: date or label) with its task list.

| Field   | Type     | Description                    |
|--------|----------|--------------------------------|
| id     | string   | Unique identifier (e.g. UUID)  |
| name   | string   | Display name (e.g. date/label) |
| tasks  | Task[]   | List of tasks (order preserved)|
| createdAt | string (ISO 8601) | Optional; for "newest first" ordering |

**Validation**: `name` required, non-empty. `tasks` array required (may be empty).

**Relationships**: One Day has many Tasks. No cross-day references.

### Task

A single item within a day; can be incomplete or completed.

| Field | Type    | Description                          |
|-------|---------|--------------------------------------|
| id    | string  | Unique identifier within the day     |
| label | string  | Text of the task                     |
| done  | boolean | Whether the task is completed        |

**Validation**: `label` required. `done` defaults to `false` if omitted.

**Ordering**: For display, incomplete tasks first, then completed (spec: "при клике на checkbox задача перечеркивается и отправляется вниз списка в раздел выполненных"). API may return tasks in one array with `done` flag; client or server can sort. Alternatively server returns `incompleteTasks` and `completedTasks` for convenience.

## State and lifecycle

- **Creation**: Day is created with name and initial tasks; each task has id, label, done=false.
- **Update**: Only supported update is marking tasks done/not-done (and optionally reordering). Day name could be editable in a future iteration (not required by current spec).
- **Deletion**: Not in scope for this feature; in-memory store loses all data on process restart.

## In-memory store

- **Structure**: Map or array of Day objects keyed by `day.id`; list endpoint returns days sorted by creation (newest first).
- **Concurrency**: Single process; no locking required for demo scope.
