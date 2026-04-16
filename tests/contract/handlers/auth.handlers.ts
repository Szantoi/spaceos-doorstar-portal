import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.get('http://localhost/bff/auth/me', () =>
    HttpResponse.json({
      sub: '00000000-0000-4000-8000-000000000001',
      email: 'test@spaceos.dev',
      name: 'Test User',
      tenantId: '00000000-0000-4000-8000-000000000002',
      tenantName: 'Test Tenant',
      roles: ['TenantAdmin'],
    })
  ),
];
