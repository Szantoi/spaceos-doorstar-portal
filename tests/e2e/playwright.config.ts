import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './flows',
  timeout: 60_000,
  retries: 1,
  workers: 1,
  use: {
    baseURL: process.env.VITE_API_BASE_URL || 'https://portal.joinerytech.hu',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  globalSetup: './global-setup.ts',
});
