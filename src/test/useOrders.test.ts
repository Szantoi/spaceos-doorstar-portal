import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useOrders } from '../hooks/useOrders';
import { ordersApi } from '../api/ordersApi';

vi.mock('../api/ordersApi', () => ({
  ordersApi: {
    list: vi.fn(),
  },
}));

const mockList = vi.mocked(ordersApi.list);

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and returns orders', async () => {
    const mockResponse = {
      items: [
        { id: 'order-1', status: 'Draft' as const, createdAt: '2026-04-16', itemCount: 0, totalItems: 0 },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 20,
    };
    mockList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useOrders(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponse);
    expect(mockList).toHaveBeenCalledTimes(1);
  });

  it('returns error state on API failure', async () => {
    mockList.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useOrders(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
