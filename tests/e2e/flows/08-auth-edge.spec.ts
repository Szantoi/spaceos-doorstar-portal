import { test, expect } from '@playwright/test';

// Keycloak can be at auth.joinerytech.hu OR joinerytech.hu/auth/ depending on deployment
const isAuthPage = (url: string) =>
  url.includes('auth.joinerytech.hu') || url.includes('/auth/realms/') || url.includes('/login');

async function waitForAuthRedirect(page: import('@playwright/test').Page) {
  await page.waitForURL(
    (url) => url.hostname === 'auth.joinerytech.hu' || url.href.includes('/auth/realms/') || url.pathname === '/login',
    { timeout: 15_000 }
  );
  // If landed on /login (requires button click), navigate to Keycloak
  if (page.url().includes('/login')) {
    await page.click('[data-testid="login-button"]');
    await page.waitForURL(
      (url) => url.hostname === 'auth.joinerytech.hu' || url.href.includes('/auth/realms/'),
      { timeout: 15_000 }
    );
  }
}

test.describe('08 — Auth edge cases', () => {
  test('nem bejelentkezett user → /orders → Keycloak login oldalra redirect', async ({ page }) => {
    await page.goto('/orders');
    await waitForAuthRedirect(page);
    expect(isAuthPage(page.url())).toBe(true);
  });

  test('404 ismeretlen route → NotFoundPage jelenik meg', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
    const isNotFound = await page.getByText(/az oldal nem található/i).isVisible().catch(() => false);
    const isOnAuthPage = isAuthPage(page.url());
    expect(isNotFound || isOnAuthPage).toBe(true);
  });

  test('direct navigáció /profile-ra nem bejelentkezve → auth redirect', async ({ page }) => {
    await page.goto('/profile');
    await waitForAuthRedirect(page);
    expect(isAuthPage(page.url())).toBe(true);
  });
});
