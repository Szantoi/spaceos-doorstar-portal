import { test, expect } from '@playwright/test';
import { test as authTest } from '../fixtures/auth.fixture';

// Keycloak can be at auth.joinerytech.hu OR joinerytech.hu/auth/ depending on deployment
const isAuthPage = (url: string) =>
  url.includes('auth.joinerytech.hu') || url.includes('/auth/realms/') || url.includes('/login');

async function waitForAuthRedirect(page: import('@playwright/test').Page) {
  await page.waitForURL(
    (url) => url.hostname === 'auth.joinerytech.hu' || url.href.includes('/auth/realms/') || url.pathname === '/login',
    { timeout: 15_000 },
  );
  // If landed on /login (requires button click), navigate to Keycloak
  if (page.url().includes('/login')) {
    await page.click('[data-testid="login-button"]');
    await page.waitForURL(
      (url) => url.hostname === 'auth.joinerytech.hu' || url.href.includes('/auth/realms/'),
      { timeout: 15_000 },
    );
  }
}

test.describe('08 — Auth edge cases (unauthenticated)', () => {
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

authTest.describe('08 — Auth edge cases (authenticated)', () => {
  authTest('logout → Keycloak login oldalra redirect', async ({ authenticatedPage: page }) => {
    await page.goto('/profile');
    await page.getByRole('button', { name: /kijelentkezés/i }).click();
    await page.waitForURL(
      (url) => url.href.includes('/auth/realms/') || url.hostname === 'auth.joinerytech.hu',
      { timeout: 15_000 },
    );
    expect(isAuthPage(page.url())).toBe(true);
  });

  authTest('unauthorized redirect: /dashboard ismeretlen route → auth redirect vagy 404', async ({ authenticatedPage: page }) => {
    // /dashboard nem létező route — NotFoundPage-t vár, vagy esetleges auth redirect
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
    const isNotFound = await page.getByText(/az oldal nem található/i).isVisible().catch(() => false);
    const isOnAuthPage = isAuthPage(page.url());
    // Bejelentkezett user esetén inkább NotFoundPage, de auth redirect is elfogadható
    expect(isNotFound || isOnAuthPage).toBe(true);
  });
});
