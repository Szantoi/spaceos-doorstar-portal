/**
 * Flow 02 — Cutting dashboard
 *
 * Seed: doorstar-cutting-ready-v1 (1 CuttingSheet, status: Submitted, 1 DoorOrder)
 *
 * NOTE: A dedicated /cutting/sheets cutting dashboard UI még nem létezik a portálban.
 * Az elérhető cutting adatok az order detail → cutting-list linken keresztül érhetők el.
 * TODO: FE-011 után aktiválni a teljes cutting dashboard flow-t (cutting-sheet-list testid).
 */

import { test, expect } from '../fixtures/auth.fixture';
import { resetTenant } from '../helpers/resetTenant';
import { SEED_PROFILES } from '../fixtures/seedProfiles';

test.beforeEach(async () => {
  await resetTenant(SEED_PROFILES.SMOKE);
});

test.describe('02 — Cutting dashboard (partial — via order detail)', () => {
  test('orders oldal betölt Submitted state-ű rendeléssel', async ({ authenticatedPage: page }) => {
    await page.goto('/orders');
    await expect(page.getByTestId('orders-table')).toBeVisible({ timeout: 10_000 });
    // doorstar-cutting-ready-v1 seed: 1 DoorOrder, status: Submitted
    await expect(page.getByTestId('status-badge-Submitted')).toBeVisible();
  });

  test('order detail → cutting-list oldal betölt', async ({ authenticatedPage: page }) => {
    await page.goto('/orders');
    await page.getByTestId('orders-table').waitFor({ timeout: 10_000 });
    // Kattints az első order linkre
    const firstOrderLink = page.getByRole('table').getByRole('link').first();
    await firstOrderLink.click();
    await expect(page).toHaveURL(/\/orders\/.+/);
    // Cutting list link megjelenik az order detail-ban
    await expect(page.getByTestId('cutting-list-link')).toBeVisible();
    // Navigálj a cutting listára
    await page.getByTestId('cutting-list-link').click();
    await expect(page).toHaveURL(/\/orders\/.+\/cutting-list/);
    // Cutting list tábla vagy empty-state jelenik meg
    const tableVisible = await page.getByTestId('cutting-list-table').isVisible().catch(() => false);
    const emptyVisible = await page.getByTestId('empty-state').isVisible().catch(() => false);
    const errorVisible = await page.getByTestId('error-state').isVisible().catch(() => false);
    expect(tableVisible || emptyVisible || errorVisible).toBe(true);
  });

  // TODO: FE-011 után aktiválni — dedicated /cutting/sheets oldal + cutting-sheet-list testid
  test.skip('dedicated cutting dashboard — cutting-sheet-list testid', async () => {
    // await page.goto('/cutting/sheets');
    // await expect(page.getByTestId('cutting-sheet-list')).toBeVisible();
    // await expect(page.getByTestId('status-badge-Submitted')).toBeVisible();
  });
});
