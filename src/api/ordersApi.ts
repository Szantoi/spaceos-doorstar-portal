import { apiClient } from './client';

export type OrderStatus = 'Draft' | 'Submitted' | 'InProduction' | 'Completed' | 'Cancelled';

export interface DoorOrder {
  id: string;
  status: OrderStatus;
  createdAt: string;
  itemCount: number;
  totalItems: number;
}

export interface OrdersResponse {
  items: DoorOrder[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface OrderItem {
  id: string;
  doorTypeId: string;
  quantity: number;
  customOptions?: Record<string, unknown>;
}

export interface OrderDetail extends DoorOrder {
  items: OrderItem[];
}

export const ordersApi = {
  list: async (): Promise<OrdersResponse> => {
    const res = await apiClient.get<OrdersResponse>('/api/orders');
    return res.data;
  },

  get: async (id: string): Promise<OrderDetail> => {
    const res = await apiClient.get<OrderDetail>(`/api/orders/${id}`);
    return res.data;
  },

  create: async (customerId: string): Promise<DoorOrder> => {
    const res = await apiClient.post<DoorOrder>('/api/orders', { customerId });
    return res.data;
  },

  addItem: async (
    orderId: string,
    item: { doorTypeId: string; quantity: number; customOptions?: Record<string, unknown> },
  ): Promise<void> => {
    await apiClient.post(`/api/orders/${orderId}/items`, item);
  },

  submit: async (orderId: string): Promise<void> => {
    await apiClient.post(`/api/orders/${orderId}/submit`);
  },
};
