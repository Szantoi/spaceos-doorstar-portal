import { test, expect } from '../fixtures/auth.fixture';

test.describe('01 — Login flow', () => {
  test('sikeres PKCE login → /orders dashboard betölt', async ({ authenticatedPage: page }) => {
    await expect(page).toHaveURL(/\/orders/);
    await expect(page.getByTestId('app-shell')).toBeVisible();
    await expect(page.getByRole('heading', { name: /rendelések/i })).toBeVisible();
  });

  test('bejelentkezett user látja az AppHeader navigációt', async ({ authenticatedPage: page }) => {
    await expect(page.getByRole('link', { name: /rendelések/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /profil/i })).toBeVisible();
  });

  test('profile oldal betölt bejelentkezett usernek', async ({ authenticatedPage: page }) => {
    await page.goto('/profile');
    await expect(page.getByTestId('profile-name')).toBeVisible();
    await expect(page.getByRole('button', { name: /kijelentkezés/i })).toBeVisible();
  });

  test('kijelentkezés → Keycloak login oldalra redirect', async ({ authenticatedPage: page }) => {
    await page.goto('/profile');
    await page.getByRole('button', { name: /kijelentkezés/i }).click();
    await page.waitForURL(/auth\.joinerytech\.hu/, { timeout: 15_000 });
  });
});
