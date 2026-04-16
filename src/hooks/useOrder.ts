import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.get(id),
    staleTime: 30_000,
    enabled: Boolean(id),
  });
}
