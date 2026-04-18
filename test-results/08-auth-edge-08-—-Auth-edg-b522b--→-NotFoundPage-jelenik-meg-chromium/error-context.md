# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 08-auth-edge.spec.ts >> 08 — Auth edge cases >> 404 ismeretlen route → NotFoundPage jelenik meg
- Location: tests/e2e/flows/08-auth-edge.spec.ts:29:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Unexpected Application Error!" [level=2] [ref=e3]
  - heading "404 Not Found" [level=3] [ref=e4]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // Keycloak can be at auth.joinerytech.hu OR joinerytech.hu/auth/ depending on deployment
  4  | const isAuthPage = (url: string) =>
  5  |   url.includes('auth.joinerytech.hu') || url.includes('/auth/realms/') || url.includes('/login');
  6  | 
  7  | async function waitForAuthRedirect(page: import('@playwright/test').Page) {
  8  |   await page.waitForURL(
  9  |     (url) => url.hostname === 'auth.joinerytech.hu' || url.href.includes('/auth/realms/') || url.pathname === '/login',
  10 |     { timeout: 15_000 }
  11 |   );
  12 |   // If landed on /login (requires button click), navigate to Keycloak
  13 |   if (page.url().includes('/login')) {
  14 |     await page.click('[data-testid="login-button"]');
  15 |     await page.waitForURL(
  16 |       (url) => url.hostname === 'auth.joinerytech.hu' || url.href.includes('/auth/realms/'),
  17 |       { timeout: 15_000 }
  18 |     );
  19 |   }
  20 | }
  21 | 
  22 | test.describe('08 — Auth edge cases', () => {
  23 |   test('nem bejelentkezett user → /orders → Keycloak login oldalra redirect', async ({ page }) => {
  24 |     await page.goto('/orders');
  25 |     await waitForAuthRedirect(page);
  26 |     expect(isAuthPage(page.url())).toBe(true);
  27 |   });
  28 | 
  29 |   test('404 ismeretlen route → NotFoundPage jelenik meg', async ({ page }) => {
  30 |     await page.goto('/this-route-does-not-exist');
  31 |     await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
  32 |     const isNotFound = await page.getByText(/az oldal nem található/i).isVisible().catch(() => false);
  33 |     const isOnAuthPage = isAuthPage(page.url());
> 34 |     expect(isNotFound || isOnAuthPage).toBe(true);
     |                                        ^ Error: expect(received).toBe(expected) // Object.is equality
  35 |   });
  36 | 
  37 |   test('direct navigáció /profile-ra nem bejelentkezve → auth redirect', async ({ page }) => {
  38 |     await page.goto('/profile');
  39 |     await waitForAuthRedirect(page);
  40 |     expect(isAuthPage(page.url())).toBe(true);
  41 |   });
  42 | });
  43 | 
```