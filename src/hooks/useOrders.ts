import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

export function useOrders(status?: string) {
  return useQuery({
    queryKey: status ? ['orders', { status }] : ['orders'],
    queryFn: () => ordersApi.list(status),
    staleTime: 30_000,
  });
}
