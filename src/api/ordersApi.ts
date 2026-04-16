import { apiClient } from './client';

export type OrderStatus = 'Draft' | 'Submitted' | 'InProduction' | 'Completed' | 'Cancelled';

export const DOOR_TYPES = [
  { id: 'dt-standard-90', label: 'Standard 90cm' },
  { id: 'dt-standard-100', label: 'Standard 100cm' },
  { id: 'dt-double-180', label: 'Dupla szárny 180cm' },
] as const;

export interface CuttingListItem {
  partCode: string;
  description: string;
  widthMm: number;
  heightMm: number;
  quantity: number;
  material: string;
}

export interface CuttingList {
  orderId: string;
  items: CuttingListItem[];
  totalSheets: number;
  estimatedWaste: number;
}

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

  calculate: async (orderId: string): Promise<void> => {
    await apiClient.post(`/api/orders/${orderId}/calculate`);
  },

  getCuttingList: async (orderId: string): Promise<CuttingList> => {
    // Cache-Control: no-store — always fresh data
    const res = await apiClient.get<CuttingList>(`/api/orders/${orderId}/cutting-list`, {
      headers: { 'Cache-Control': 'no-store' },
    });
    return res.data;
  },
};
