import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

export function useCuttingList(orderId: string) {
  return useQuery({
    queryKey: ['cutting-list', orderId],
    queryFn: () => ordersApi.getCuttingList(orderId),
    enabled: Boolean(orderId),
    staleTime: 0, // always refetch — data changes after calculate
  });
}
