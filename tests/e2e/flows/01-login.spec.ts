import { test, expect } from '../fixtures/auth.fixture';
import { TEST_IDS } from '../helpers/testIds';

test.describe('01 — Login flow', () => {
  test('sikeres PKCE login → /orders dashboard betölt', async ({ authenticatedPage: page }) => {
    await expect(page).toHaveURL(/\/orders/);
    await expect(page.getByTestId(TEST_IDS.APP_SHELL)).toBeVisible();
    await expect(page.getByRole('heading', { name: /rendelések/i })).toBeVisible();
  });

  test('bejelentkezett user látja az AppHeader navigációt', async ({ authenticatedPage: page }) => {
    await expect(page.getByRole('link', { name: /rendelések/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /profil/i })).toBeVisible();
  });

  test('nav-sidebar legalább 1 nav item látható', async ({ authenticatedPage: page }) => {
    const sidebar = page.getByTestId(TEST_IDS.NAV_SIDEBAR);
    await expect(sidebar).toBeVisible();
    const navItems = sidebar.getByRole('link');
    await expect(navItems.first()).toBeVisible();
  });

  test('user-menu látható bejelentkezett állapotban', async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId(TEST_IDS.USER_MENU)).toBeVisible();
  });

  test('profile oldal betölt bejelentkezett usernek', async ({ authenticatedPage: page }) => {
    await page.goto('/profile');
    await expect(page.getByTestId(TEST_IDS.PROFILE_NAME)).toBeVisible();
    await expect(page.getByRole('button', { name: /kijelentkezés/i })).toBeVisible();
  });

  test('kijelentkezés → Keycloak login oldalra redirect', async ({ authenticatedPage: page }) => {
    await page.goto('/profile');
    await page.getByRole('button', { name: /kijelentkezés/i }).click();
    await page.waitForURL(
      (url) => url.href.includes('/auth/realms/') || url.hostname === 'auth.joinerytech.hu',
      { timeout: 15_000 },
    );
  });
});
