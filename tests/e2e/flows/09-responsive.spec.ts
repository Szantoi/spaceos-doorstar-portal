import { test, expect } from '../fixtures/auth.fixture';

test.describe('09 — Responsive layout', () => {
  test('desktop nézet — AppHeader teljes szélességben látható', async ({ authenticatedPage: page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByTestId('app-header')).toBeVisible();
    await expect(page.getByRole('link', { name: /rendelések/i })).toBeVisible();
  });

  test('mobil nézet (375px) — oldal görgethetően megjelenik', async ({ authenticatedPage: page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/orders');
    await expect(page.getByTestId('app-shell')).toBeVisible();
    // Overflow-x ellenőrzés: ne legyen vízszintes scroll
    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);
  });
});
