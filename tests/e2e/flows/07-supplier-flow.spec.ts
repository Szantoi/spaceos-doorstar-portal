/**
 * Flow 07 — Supplier flow
 *
 * Seed: doorstar-cutting-ready-v1 (suppliers: 1 — PROCUREMENT-006 DONE)
 *
 * NOTE: A /suppliers UI route nem létezik a portálban.
 * CONTRACT_ISSUES.md: CI-002 — GET /bff/procurement/suppliers endpoint hiánya a FE-n
 * TODO: FE-012 után aktiválni, amikor a Supplier UI route implementált.
 */

import { test } from '../fixtures/auth.fixture';
import { resetTenant } from '../helpers/resetTenant';
import { SEED_PROFILES } from '../fixtures/seedProfiles';

test.beforeEach(async () => {
  await resetTenant(SEED_PROFILES.SMOKE);
});

test.describe('07 — Supplier flow', () => {
  // TODO: FE-012 után aktiválni — /suppliers route + supplier-list testid szükséges
  // CONTRACT_ISSUE: CI-002 filed — nincs Supplier UI a portálban
  test.skip('supplier lista betölt legalább 1 elemmel', async () => {
    // await page.goto('/suppliers');
    // await expect(page.getByTestId('supplier-list')).toBeVisible();
    // Legalább 1 supplier sor (doorstar-cutting-ready-v1: 1 supplier)
  });

  test.skip('supplier detail nézet betölt', async () => {
    // await page.goto('/suppliers');
    // await page.getByRole('table').getByRole('link').first().click();
    // await expect(page).toHaveURL(/\/suppliers\/.+/);
    // await expect(page.getByTestId('supplier-detail')).toBeVisible();
  });

  test.skip('procurement összesítő — aktív rendelések száma látható', async () => {
    // await page.goto('/procurement');
    // await expect(page.getByTestId('procurement-summary')).toBeVisible();
  });
});
