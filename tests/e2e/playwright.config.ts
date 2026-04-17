import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './flows',
  timeout: 60_000,
  retries: 1,
  workers: 1,
  use: {
    // Portal UI URL — distinct from VITE_API_BASE_URL (BFF base: joinerytech.hu)
    baseURL: process.env.TEST_PORTAL_URL || 'https://portal.joinerytech.hu',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  globalSetup: './global-setup.ts',
});
