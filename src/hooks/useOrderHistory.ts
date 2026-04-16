import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

export function useOrderHistory(orderId: string) {
  return useQuery({
    queryKey: ['order-history', orderId],
    queryFn: () => ordersApi.getOrderHistory(orderId),
    staleTime: 30_000,
    enabled: Boolean(orderId),
  });
}
