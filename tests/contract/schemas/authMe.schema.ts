import { z } from 'zod';

export const AuthMeResponseSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  tenantId: z.string().uuid(),
  tenantName: z.string().optional(),
  roles: z.array(z.string()),
});

export type AuthMeResponse = z.infer<typeof AuthMeResponseSchema>;
