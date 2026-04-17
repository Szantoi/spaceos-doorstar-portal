/**
 * Flow 03 — Daily plan management
 *
 * Seed: doorstar-cutting-ready-v1
 *
 * NOTE: A /cutting/plans daily plan UI még nem létezik a portálban.
 * TODO: FE-011 után aktiválni, amikor a daily plan oldal implementált.
 */

import { test } from '../fixtures/auth.fixture';
import { resetTenant } from '../helpers/resetTenant';
import { SEED_PROFILES } from '../fixtures/seedProfiles';

test.beforeEach(async () => {
  await resetTenant(SEED_PROFILES.SMOKE);
});

test.describe('03 — Daily plan management', () => {
  // TODO: FE-011 után aktiválni — /cutting/plans route + daily-plan-page testid szükséges
  test.skip('daily plan oldal betölt', async () => {
    // await page.goto('/cutting/plans');
    // await expect(page.getByTestId('daily-plan-page')).toBeVisible();
    // await expect(page).not.toHaveURL(/error|404/);
  });

  test.skip('új plan létrehozás form megjelenik', async () => {
    // await page.goto('/cutting/plans');
    // await page.getByRole('button', { name: /új plan/i }).click();
    // Sheet assignment + mentés
  });
});
