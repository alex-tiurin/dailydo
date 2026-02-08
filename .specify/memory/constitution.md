<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Modified principles: none
- Added sections: none
- Removed sections: none
- Development Workflow: materially expanded (test cases → red unit tests → code → green unit → UI via MCP/skills)
- Templates: plan-template.md ✅ updated; spec-template.md ✅ updated; tasks-template.md ✅ updated
- Follow-up TODOs: none
-->

# Daily Do Constitution

## Core Principles

### I. React Web Application

The primary deliverable for this constitution is the web application (React). Frontend lives in `webapp/`; backend is Node.js with in-memory storage for demo. Android and iOS apps may exist in the repo but governance here applies to the React web UI and its features.

**Rationale**: Clear scope ensures planning, specs, and tasks target the correct codebase and tooling.

### II. Unit and UI Tests per Feature

Every feature MUST be accompanied by unit tests and UI tests. No feature is considered complete without both.

- Unit tests: cover logic, hooks, utilities, and components in isolation (e.g. Jest, React Testing Library).
- UI tests: cover user flows and critical paths in the running app (e.g. Playwright or similar).

**Rationale**: Prevents regressions and documents expected behaviour; both levels are required for confidence.

### III. Green Tests Before Commit

Before performing a commit, the team MUST run the test suite. The commit MUST only proceed if all tests are green. Red tests block the commit.

**Rationale**: Keeps mainline stable and enforces the discipline that broken tests are fixed, not committed.

### IV. Agent History After Feature

After completing development of a feature, an aggregating file MUST be created in the `agent_history/` folder. The file MUST summarize which commands and steps were executed during the feature work (e.g. commands run, key decisions, artifacts produced).

**Rationale**: Provides an audit trail and repeatability for agents and humans; supports onboarding and debugging.

## Technology Stack

- **Frontend**: React (webapp in repository root, e.g. `webapp/`).
- **Backend**: Node.js; in-memory storage for demo (no DB required by this constitution).
- **Testing**: Unit (e.g. Jest + React Testing Library); UI (e.g. Playwright or project-chosen E2E).
- **Platform**: Web; browser targets as defined by the project and CI.

## Development Workflow

When changing UI or business logic, follow this order. Each step MUST be completed before the next.

1. **Test cases (text)**  
   From the description of the new functionality or user change, create a set of test cases in text form (scenarios, preconditions, expected results). This defines what “done” means before any code.

2. **Unit tests (red)**  
   Generate the corresponding unit tests from the test cases. Run the unit test suite; the new tests MUST fail (code does not yet implement the behaviour).

3. **Implementation**  
   Change application or server code to implement the new behaviour. Do not skip or weaken the tests to make them pass.

4. **Unit tests (green)**  
   Run the unit test suite again. All tests MUST pass. If any fail, fix the implementation (or correct the tests if they were wrong); do not commit with failing unit tests.

5. **UI tests**  
   Generate UI tests (e.g. using MCP server and project skills, e.g. Playwright). Add or adjust UI tests so they cover the critical user flows from the test cases.

6. **UI tests green**  
   Run the UI test suite and fix failures until all UI tests pass. UI tests MUST be stable and runnable as part of the project.

7. **Pre-commit gate**  
   Before every commit, run the full test suite (unit + UI). Commit only when all tests are green.

8. **Post-feature**  
   After completing the feature, create or update an aggregating file in `agent_history/` with the commands and main steps executed.

Compliance with this workflow is expected in code review and in any agent-driven implementation.

## Governance

This constitution overrides conflicting local practices for the scope it defines. Amendments require:

- Updating this file with clear rationale.
- Bumping the version (MAJOR.MINOR.PATCH) and setting Last Amended to the change date.
- Propagating changes to dependent templates (plan, spec, tasks) and any referenced guidance.

All feature work and PRs MUST be checked for alignment with the principles above. Complexity or exceptions MUST be justified and documented. Use `AGENTS.md` and project README for runtime development guidance.

**Version**: 1.1.0 | **Ratified**: 2025-02-07 | **Last Amended**: 2025-02-07
