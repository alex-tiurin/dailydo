---
name: assertum-ui-tests
description: Create, update, and validate UI tests by driving the Assertum MCP server only. Use when asked to write or modify UI tests, record UI scenarios, or operate with assertum_tree, assertum_batch_action, assertum_batch_assertion, assertum_generate_screen_object, assertum_test_scenario, assertum_restart_test, assertum_save_test, assertum_search_tests, assertum_get_test, or assertum_screenshot.
---

# Assertum UI Tests

## Overview

Create UI test scenarios using only the Assertum MCP tools, then save them with Assertum. Do not generate or edit test code or files directly.

## Workflow

1. Check for existing tests when a name is provided.
   - Call `assertum_search_tests` with the proposed name.
   - If the user wants to recreate or update a test, call `assertum_get_test` to read the original prompt.
2. Start from a clean slate unless the user explicitly wants to continue.
   - Call `assertum_restart_test` to restart the app and clear the scenario.
3. Inspect the UI state.
   - Call `assertum_tree` to locate the target elements.
   - If the tree is ambiguous, call `assertum_screenshot`, then re-check `assertum_tree`.
4. Get available screen object steps functions with call `assertum_list_screen_steps`
5. Handle strict page object mode if needed.
   - If `assertum_batch_action` or `assertum_batch_assertion` returns an item with `errorCode: "STRICT_PAGE_OBJECT_REQUIRED"`, strict mode is active and no screen object is set for the current screen.
   - Call `assertum_generate_screen_object` with a `screenName` derived from the current screen context (e.g. infer from the visible UI or ask the user).
   - After a successful generation response, retry the blocked action or assertion.
   - Do not proceed without a screen object when strict mode is blocking; generation is the only valid recovery path.
6. Execute actions.
   - Use `assertum_batch_action` for taps, input, scrolls, and selections. Batch related interactions into one call when possible.
   - Re-run `assertum_tree` after navigation or any major state change.
7. Add assertions.
   - Use `assertum_batch_assertion` for presence, text, enabled/disabled, or selection state. Batch related checks into one call when possible.
   - Assert after each meaningful step when the UI stabilizes.
8. Prefer screen object step functions via `assertum_invoke_screen_step` over independent actions if there step function that will cover the necessary part of scenario.
9. Use `assertum_create_screen_step` create reusable step functions and never skip this step, assertum_create_screen_step is important
   - Prefer parameterized step functions over hard-coded example data.
   - Extract one coherent reusable user intent per step, even when that intent spans several contiguous UI commands.
   - Prefer grouped domain-level steps such as `typeAndSendMessage(message)`, `login(username, password)`, or `searchFor(query)` over per-control steps when the sequence is stable and clearly belongs together.
   - Combine several actions into one step function when they are logically grouped and the resulting step is more reusable than the individual commands.
   - Only split into smaller steps when the grouped flow would hide meaningful variation, mix unrelated intents, or reduce reuse.
   - Do not create steps that mix a reusable action with a fixed example outcome when arguments or a separate assertion step would keep the step reusable.
   - When the recorded scenario contains literal values, convert them into `argNames` and map those literals with `valueTemplatesByScenarioIndex`.
   - Keep assertions separate unless the assertion is intrinsic to the UI intent of that step. Prefer `calculateSum(a, b)` plus `assertResult(expectedResult)` over `enterFirstNumber(value)`, `enterSecondNumber(value)`, `selectAddOperation()`, `calculate()`, and a final assertion when the grouped action is the clearer reusable abstraction.
10. Review the scenario.
   - You can remove or reorder the actions in the scenario by `assertum_list_screen_steps`
   - If the flow is completely wrong or redundant, restart and re-record
   - Check that step functions is used or invoke assertum_create_screen_step
11. Save the test.
   - Call `assertum_save_test` with the agreed name and the user's request as the prompt.

## Tooling Rules

- Use only Assertum MCP tools listed above; do not use any other automation tools.
- Do not write or edit test code, files, or scripts; record actions and assertions only via tools.
- Do not call unrelated tools when this skill is active.
- When strict mode blocks an action or assertion (`errorCode: "STRICT_PAGE_OBJECT_REQUIRED"`), always call `assertum_generate_screen_object` before retrying — never skip or ignore the block.

## Element Discovery

- Use `assertum_tree` to identify elements by text, role, and hierarchy.
- When multiple matches exist, refine by ancestor context or nearby labels.
- Re-fetch `assertum_tree` after each screen transition.
- Re-fetch `assertum_list_screen_steps` after each screen transition.

## Assertions

- Prefer already existing screen object step functions over independent actions.
- Prefer stable labels or content descriptions over transient text.
- Use explicit assertions for key outcomes (navigation, validation messages, state toggles).
- Do not hide unrelated assertions inside broad action steps. If the expected value varies per test, make it an argument or create a dedicated assertion step.

## Step Function Quality

- Prefer names that describe reusable behavior, not example data.
- Good: `calculateSum(a, b)`, `selectOperation(operation)`, `assertResult(expectedText)`.
- Bad: `calculateOnePlusTwoAndVerifyResult()`, `fillLoginWithValidCredentialsAndOpenHome()`.
- A screen step should usually represent one reusable user-facing intent:
   - navigation
   - a grouped form/data-entry action
   - a grouped operation or submission flow
   - a focused assertion
- Prefer the highest-level reusable step that still has a clear purpose and clean arguments.
- Before creating a step, first check whether contiguous recorded commands should be grouped into one domain-level action; only then consider splitting into smaller steps.

## Diagnostics

- Use `assertum_screenshot` for visual context when the tree is insufficient or the user requests it.
- If an assertion fails, re-check `assertum_tree` for updated semantics before retrying.

## Trigger Examples

- "Write a UI test for the login flow using Assertum."
- "Recreate the existing 'settings-toggle' UI test."
- "Add assertions for the onboarding screen after tapping Continue."
