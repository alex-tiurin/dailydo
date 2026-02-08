# Research: Playwright UI Tests for Webapp

**Feature**: 002-playwright-ui-tests  
**Date**: 2025-02-07

## 1. Where to put tests and config

**Decision**: Tests in `webapp/e2e/`, config in `webapp/playwright.config.ts`. Run from webapp directory.

**Rationale**: Keeps E2E tests next to the app they test; single package.json script; no monorepo root needed.

**Alternatives considered**: Root-level `e2e/` (rejected: ties tests to repo root and multiple apps). Separate `playwright/` project (rejected: more moving parts for one webapp).

## 2. How to start the webapp during tests

**Decision**: Use Playwright `webServer` to run `next dev` (or `pnpm dev`) when not using a pre-set baseURL. Allow override via env (e.g. CI starts app separately and sets BASE_URL).

**Rationale**: One command (`pnpm test:e2e`) runs app and tests; CI can set baseURL to a pre-started URL.

**Alternatives considered**: Always require pre-started app (rejected: worse DX for local). Only webServer (rejected: CI may need different strategy).

## 3. Browser targets

**Decision**: Default to Chromium only for speed; document how to add Firefox/WebKit in config if needed.

**Rationale**: Spec says "browser targets can be narrowed or extended"; Chromium is fastest and sufficient for MVP.

## 4. Test isolation (localStorage)

**Decision**: Each test that mutates state runs in a fresh context, or tests explicitly clear localStorage / use a clean page. Playwright’s default new context per test gives isolation if we don’t share storage.

**Rationale**: Spec requires tests not to depend on order; fresh browser context per test is the default and avoids cross-test pollution.

## 5. Selectors strategy

**Decision**: Prefer role and text for resilience (e.g. getByRole('link', { name: 'New List' }), getByText('No task lists yet')). Use data-testid only where necessary for stability.

**Rationale**: Aligns with Playwright best practices; less coupling to implementation.
