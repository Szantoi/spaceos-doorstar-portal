/**
 * Flow 05 — Inventory overview
 *
 * Seed: doorstar-cutting-ready-v1 (5 PanelStock)
 *
 * NOTE: Az inventory oldal (/inventory) még nem létezik a portálban.
 * TODO: FE-011 után aktiválni, amikor az inventory route + panel-stock-list implementált.
 */

import { test } from '../fixtures/auth.fixture';
import { resetTenant } from '../helpers/resetTenant';
import { SEED_PROFILES } from '../fixtures/seedProfiles';

test.beforeEach(async () => {
  await resetTenant(SEED_PROFILES.SMOKE);
});

test.describe('05 — Inventory overview', () => {
  // TODO: FE-011 után aktiválni — /inventory route + panel-stock-list testid szükséges
  test.skip('inventory oldal betölt 5 PanelStock-kal', async () => {
    // await page.goto('/inventory');
    // await expect(page.getByTestId('panel-stock-list')).toBeVisible();
    // Legalább 5 sor, vagy "5 termék" szöveg
  });

  test.skip('StockLevel összesítő kártyák láthatók', async () => {
    // await page.goto('/inventory');
    // await expect(page.getByTestId('stock-level-summary')).toBeVisible();
  });
});
