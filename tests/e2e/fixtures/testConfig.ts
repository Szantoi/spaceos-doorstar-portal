export const testConfig = {
  tenantId: process.env.TEST_TENANT_ID ?? '2c84d541-4ccf-4b3a-a932-aca21c43a99e',
  userEmail: process.env.TEST_USER_EMAIL ?? 'test-doorstar@spaceos.dev',
  userPassword: process.env.TEST_USER_PASSWORD ?? '',
  apiBase: process.env.VITE_API_BASE_URL ?? 'https://joinerytech.hu',
  portalBase: process.env.TEST_PORTAL_URL ?? 'https://portal.joinerytech.hu',
  bffEnabled: process.env.TEST_BFF_ENABLED === 'true',
} as const;
