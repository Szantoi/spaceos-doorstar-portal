import { test as base, Page } from '@playwright/test';

// Keycloak can be at auth.joinerytech.hu OR joinerytech.hu/auth/ depending on deployment
const isKeycloakURL = (url: URL) =>
  url.hostname === 'auth.joinerytech.hu' || url.href.includes('/auth/realms/');

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/');

    // App may auto-redirect to Keycloak OR show /login page with button
    await page.waitForURL(
      (url) => isKeycloakURL(url) || url.pathname === '/login',
      { timeout: 15_000 }
    );

    // If landed on /login page, click button to trigger PKCE redirect
    if (page.url().includes('/login')) {
      await page.click('[data-testid="login-button"]');
      await page.waitForURL(isKeycloakURL, { timeout: 15_000 });
    }

    // Fill Keycloak login form
    await page.fill('#username', process.env.TEST_USER_EMAIL || 'test-doorstar@spaceos.dev');
    await page.fill('#password', process.env.TEST_USER_PASSWORD!);
    await page.click('#kc-login');

    // Wait for redirect back to portal
    await page.waitForURL(
      (url) => url.hostname.includes('portal.joinerytech'),
      { timeout: 15_000 }
    );
    await page.waitForSelector('[data-testid="app-shell"]', { timeout: 15_000 });

    await use(page);
  },
});

export { expect } from '@playwright/test';
