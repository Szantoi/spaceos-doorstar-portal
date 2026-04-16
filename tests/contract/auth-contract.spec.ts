// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/auth.handlers';
import { AuthMeResponseSchema } from './schemas/authMe.schema';

vi.mock('../../src/auth/keycloak.config', () => ({
  userManager: { getUser: async () => null },
}));

const server = setupServer(...authHandlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  server.close();
});

async function fetchAuthMe() {
  const response = await fetch('http://localhost/bff/auth/me');
  return response.json();
}

describe('GET /bff/auth/me contract', () => {
  it('response matches AuthMeResponseSchema', async () => {
    const data = await fetchAuthMe();
    const parsed = AuthMeResponseSchema.safeParse(data);
    expect(parsed.success).toBe(true);
  });

  it('roles is an array', async () => {
    const data = await fetchAuthMe();
    expect(Array.isArray(data.roles)).toBe(true);
  });

  it('tenantId is a valid UUID', async () => {
    const data = await fetchAuthMe();
    const result = AuthMeResponseSchema.pick({ tenantId: true }).safeParse({ tenantId: data.tenantId });
    expect(result.success).toBe(true);
  });
});
