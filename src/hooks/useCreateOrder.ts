import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ordersApi, type CreateOrderInput } from '../api/ordersApi';

export function useCreateOrder(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateOrderInput) => ordersApi.createOrder(data),
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      onSuccess?.();
      navigate(`/orders/${newOrder.id}`);
    },
  });
}
