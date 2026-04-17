/**
 * Flow 04 — Nesting vizualizáció
 *
 * Seed: doorstar-cutting-ready-v1
 *
 * NOTE: Nesting indítása UI / SVG-Canvas vizualizáció még nem létezik a portálban.
 * TODO: FE-011 után aktiválni, amikor a nesting trigger + SVG vizualizáció implementált.
 */

import { test } from '../fixtures/auth.fixture';
import { resetTenant } from '../helpers/resetTenant';
import { SEED_PROFILES } from '../fixtures/seedProfiles';

test.beforeEach(async () => {
  await resetTenant(SEED_PROFILES.SMOKE);
});

test.describe('04 — Nesting vizualizáció', () => {
  // TODO: FE-011 után aktiválni — "Nesting indítása" gomb + SVG/Canvas megjelenés
  test.skip('nesting trigger → SVG/Canvas megjelenik', async () => {
    // await page.goto('/cutting/sheets');
    // Click first row → detail
    // await page.getByRole('button', { name: /nesting/i }).click();
    // await page.waitForSelector('svg, canvas');
  });

  test.skip('cutting sheets lista betölt', async () => {
    // await page.goto('/cutting/sheets');
    // await expect(page.getByTestId('cutting-sheet-list')).toBeVisible();
  });
});
