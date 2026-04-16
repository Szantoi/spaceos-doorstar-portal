export default async function globalSetup(): Promise<void> {
  const testEndpointsEnabled = process.env.TEST_BFF_ENABLED === 'true';

  if (!testEndpointsEnabled) {
    console.log('ℹ️  Test BFF endpoint not yet available — skipping tenant reset');
    return;
  }

  // TODO: aktiválni, ha BE-TEST-01 DONE
  const apiBase = process.env.VITE_API_BASE_URL || 'https://portal.joinerytech.hu';
  const response = await fetch(`${apiBase}/bff/test/tenants/${process.env.TEST_TENANT_ID}/reset`, {
    method: 'POST',
    headers: {
      'X-Test-Seeder-Secret': process.env.TEST_SEEDER_SECRET!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ seedProfile: 'doorstar-order-lifecycle-v1' }),
  });
  if (!response.ok) throw new Error(`Test tenant reset failed: ${response.status}`);
}
