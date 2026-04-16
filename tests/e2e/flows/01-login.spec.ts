import { test, expect } from '../fixtures/auth.fixture';

test.describe('Login flow', () => {
  test('successful PKCE login shows orders dashboard', async ({ authenticatedPage: page }) => {
    await expect(page).toHaveURL(/\/orders/);
    await expect(page.getByRole('heading', { name: /rendelések/i })).toBeVisible();
  });

  test('logout redirects to Keycloak login page', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: /profil/i }).click();
    await page.getByRole('button', { name: /kijelentkezés/i }).click();
    await page.waitForURL(/auth\.joinerytech\.hu/);
    await expect(page).toHaveURL(/auth\.joinerytech\.hu/);
  });
});
