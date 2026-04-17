/**
 * Flow 06 — Order lifecycle
 *
 * Seed: doorstar-cutting-ready-v1 (1 DoorOrder, status: Submitted)
 */

import { test, expect } from '../fixtures/auth.fixture';
import { resetTenant } from '../helpers/resetTenant';
import { SEED_PROFILES } from '../fixtures/seedProfiles';

test.beforeEach(async () => {
  await resetTenant(SEED_PROFILES.SMOKE);
});

test.describe('06 — Order lifecycle', () => {
  test('orders lista betölt legalább 1 rendeléssel', async ({ authenticatedPage: page }) => {
    await page.goto('/orders');
    await expect(page.getByTestId('orders-table')).toBeVisible({ timeout: 10_000 });
    // doorstar-cutting-ready-v1 seed: 1 DoorOrder — header sor + legalább 1 adat sor
    const rowCount = await page.getByRole('table').getByRole('row').count();
    expect(rowCount).toBeGreaterThanOrEqual(2);
  });

  test('Submitted státuszú rendelés látható a listában', async ({ authenticatedPage: page }) => {
    await page.goto('/orders');
    await expect(page.getByTestId('orders-table')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('status-badge-Submitted')).toBeVisible();
  });

  test('rendelésre kattintva az order detail betölt', async ({ authenticatedPage: page }) => {
    await page.goto('/orders');
    await page.getByTestId('orders-table').waitFor({ timeout: 10_000 });
    const firstLink = page.getByRole('table').getByRole('link').first();
    await firstLink.click();
    await expect(page).toHaveURL(/\/orders\/.+/);
    await expect(page.getByTestId('order-id')).toBeVisible({ timeout: 10_000 });
  });

  test('order detail tartalmaz cutting-list linket', async ({ authenticatedPage: page }) => {
    await page.goto('/orders');
    await page.getByTestId('orders-table').waitFor({ timeout: 10_000 });
    await page.getByRole('table').getByRole('link').first().click();
    await expect(page).toHaveURL(/\/orders\/.+/);
    await expect(page.getByTestId('cutting-list-link')).toBeVisible({ timeout: 10_000 });
  });
});
