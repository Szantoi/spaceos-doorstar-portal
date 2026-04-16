import { test as base, Page } from '@playwright/test';

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/');
    await page.waitForURL(/auth\.joinerytech\.hu/);
    await page.fill('#username', process.env.TEST_USER_EMAIL || 'test-doorstar@spaceos.dev');
    await page.fill('#password', process.env.TEST_USER_PASSWORD!);
    await page.click('#kc-login');
    await page.waitForURL(/portal\.joinerytech\.hu/);
    await page.waitForSelector('[data-testid="app-shell"]', { timeout: 15_000 });
    await use(page);
  },
});

export { expect } from '@playwright/test';
