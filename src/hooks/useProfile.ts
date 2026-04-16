import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export interface UserProfile {
  sub: string;
  email?: string;
  name?: string;
  tenantId: string;
  tenantName?: string;
  roles: string[];
}

export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: () => apiClient.get<UserProfile>('/auth/me').then((r) => r.data),
    staleTime: 5 * 60_000,
  });
}
