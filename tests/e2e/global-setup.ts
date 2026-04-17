import { testConfig } from './fixtures/testConfig';
import { SEED_PROFILES } from './fixtures/seedProfiles';

export default async function globalSetup(): Promise<void> {
  if (!testConfig.bffEnabled) {
    console.log('ℹ️  TEST_BFF_ENABLED != true — skipping tenant reset');
    return;
  }

  const url =
    `${testConfig.apiBase}/bff/test/tenants/${testConfig.tenantId}/reset?confirm=true`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-SpaceOS-Internal': 'true',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ seedProfile: SEED_PROFILES.EMPTY }),
  });

  if (!response.ok) {
    throw new Error(`Tenant reset failed: ${response.status} ${await response.text()}`);
  }

  const result = await response.json() as { tenantId: string; seedProfile: string };
  console.log(`✅ Tenant reset OK — profile: ${result.seedProfile}`);
}
