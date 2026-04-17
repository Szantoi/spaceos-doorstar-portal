import { testConfig } from '../fixtures/testConfig';
import { SeedProfile } from '../fixtures/seedProfiles';

/**
 * Reset the test tenant to a given seed profile.
 * Called in beforeEach for seed-dependent flows.
 */
export async function resetTenant(seedProfile: SeedProfile | string): Promise<void> {
  const { tenantId, apiBase } = testConfig;
  const url = `${apiBase}/bff/test/tenants/${tenantId}/reset?confirm=true`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'X-SpaceOS-Internal': 'true',
      'X-SpaceOS-Brand': 'joinerytech',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ seedProfile }),
  });

  if (!res.ok) {
    throw new Error(`Tenant reset failed [${res.status}]: ${await res.text()}`);
  }

  const result = await res.json() as { seedProfile: string };
  console.log(`✅ resetTenant OK — profile: ${result.seedProfile ?? seedProfile}`);
}
