# Detailed Test List: Daily Do Webapp (Playwright)

**Feature**: 002-playwright-ui-tests  
**Date**: 2025-02-07

## List-of-days screen (Home)

| ID   | Test case | Precondition | Steps | Expected |
|------|-----------|--------------|--------|----------|
| L1   | Empty state shown when no lists | No lists in storage | Open `/` | Page shows "No task lists yet" and link/button "New List" |
| L2   | Header and New List action visible | Any | Open `/` | Header "Daily Do" and New List button/link present |
| L3   | Lists displayed when data exists | At least one list in storage | Open `/` | At least one card/link with list name and progress (e.g. 0/2) |
| L4   | Newest list first | Two or more lists | Open `/` | First card is the most recently created list |
| L5   | Navigate to create from empty state | No lists | Open `/`, click New List | Navigate to `/create` |
| L6   | Navigate to create from header | Any | Open `/`, click header New List | Navigate to `/create` |
| L7   | Navigate to day detail from card | At least one list | Open `/`, click first list card | Navigate to `/day/:id` for that list |

## Create-day screen

| ID   | Test case | Precondition | Steps | Expected |
|------|-----------|--------------|--------|----------|
| C1   | Create form visible | — | Open `/create` | "List Name" input, "Tasks" section, "Create List" button visible |
| C2   | Create button disabled when name empty | — | Open `/create`, leave name empty, add one task text | Create List button disabled |
| C3   | Create button disabled when no tasks | — | Open `/create`, enter name, remove all task text | Create List button disabled |
| C4   | Create list and redirect to home | — | Open `/create`, fill name and at least one task, submit | Redirect to `/`; new list appears first in list |
| C5   | Add task button adds new input | — | Open `/create`, click Add Task | Extra task input appears |
| C6   | Back navigation | — | Open `/create`, click back | Navigate to `/` |

## Day-detail screen (view/edit, task toggle)

| ID   | Test case | Precondition | Steps | Expected |
|------|-----------|--------------|--------|----------|
| D1   | Day detail shows name and tasks | One list with tasks | Open `/day/:id` | List name in header; tasks visible with checkboxes |
| D2   | Progress summary shows count | List with N tasks | Open `/day/:id` | Progress shows 0/N or similar |
| D3   | Toggle task to done | List with at least one incomplete task | Open `/day/:id`, click first task checkbox | Task moves to "Completed" section or shows completed style (strikethrough) |
| D4   | Toggle task back to incomplete | List with at least one completed task | Open `/day/:id`, click a completed task checkbox | Task moves back to "To Do" or loses completed style |
| D5   | Completed section visible when all done | List with all tasks completed | Open `/day/:id` | "Completed" section shows count; "All tasks completed!" or similar |
| D6   | Not found when invalid id | — | Open `/day/invalid-id` | "Not found" or "This list doesn't exist" message; no crash |
| D7   | Back to home from day | List exists | Open `/day/:id`, click back | Navigate to `/` |

## Full flow (integration)

| ID   | Test case | Precondition | Steps | Expected |
|------|-----------|--------------|--------|----------|
| F1   | Create then see on home | No lists | Open `/`, go to create, create list with name + 2 tasks, submit | Redirect to `/`; one card with that name and 0/2 |
| F2   | Create, open day, toggle one task | No lists | Do F1, click the new list card, click first task checkbox | Task appears in Completed; progress 1/2 |
| F3   | List order newest first after create | No lists | Do F1, go to create again, create second list, submit | Two cards; second-created list is first card |

---

**Total**: 17 test cases across list (7), create (6), day-detail (7), full flow (3). Implementation can merge some into fewer spec files (list.spec.ts, create.spec.ts, day-detail.spec.ts) with multiple `test()` blocks.
