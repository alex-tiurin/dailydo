// Two test variants in one template file. Pick the one that matches your scenario.
// Reference integration: webapp/tests/integration/my-lists.spec.ts
// Reference e2e:         webapp/tests/e2e/list-crud.spec.ts

// =============================================================================
// VARIANT A — Integration test (mocked backend, short flat sequence, NO test.step)
// =============================================================================
// Use when: 2–5 Step calls, deterministic data via mocks.

import { test, expect } from '@playwright/test'
import { mockApiLists, DEFAULT_MOCK_LISTS } from './helpers/mock-api'
import { XxxPage } from '../page-objects/XxxPage'

test.describe('Xxx screen — integration', () => {
  test('shows the expected state with mocked data', async ({ page }) => {
    // 1. Mock setup — infrastructure, BEFORE instantiating the Page Object.
    await mockApiLists(page, DEFAULT_MOCK_LISTS)

    // 2. Only Step calls below — no page.* allowed.
    const xxx = new XxxPage(page)
    await xxx.open()
    await xxx.verifyItemVisible('mock-list-1')
  })
})

// =============================================================================
// VARIANT B — E2e test (real backend, multi-phase scenario, WITH test.step)
// =============================================================================
// Use when: 5+ Step calls across distinct logical phases (open / navigate / fill / verify).
// Wrap each phase in test.step('<human-readable name>', async () => { ... }) — the wrapper
// is purely narrative for the HTML report and does NOT replace verification inside Step methods.

/**
 * E2E Xxx Tests
 *
 * Tests run against the real running app with in-memory backend (no API mocking).
 *
 * Exploratory findings (YYYY-MM-DD):
 * - <document any partial implementations and why specific tests are skipped>
 */

import { YyyPage } from '../page-objects/YyyPage'

test.describe('E2E Xxx flow', () => {
  test('completes the happy-path flow', async ({ page }) => {
    const xxx = new XxxPage(page)
    const yyy = new YyyPage(page)
    const itemName = `Item ${Date.now()}`

    await test.step('open Xxx page', async () => {
      await xxx.open()
    })

    await test.step('navigate to Yyy', async () => {
      await xxx.clickPrimaryButton()
    })

    await test.step('fill the form and submit', async () => {
      await yyy.fillName(itemName)
      await yyy.submit()
    })

    await test.step('verify the item appears on Xxx', async () => {
      await xxx.verifyItemWithNameVisible(itemName)
    })
  })

  // Skip tests for partially implemented features. Always document why in a header comment above.
  test.skip('placeholder for unimplemented feature', async ({ page }) => {
    // TODO: enable when <missing UI/API> is implemented
  })
})
