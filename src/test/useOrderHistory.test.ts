import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useOrderHistory } from '../hooks/useOrderHistory';
import { ordersApi } from '../api/ordersApi';

vi.mock('../api/ordersApi', () => ({
  ordersApi: { getOrderHistory: vi.fn() },
  DOOR_TYPES: [],
}));

const mockGetOrderHistory = vi.mocked(ordersApi.getOrderHistory);

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children);
}

describe('useOrderHistory', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches order history for given orderId', async () => {
    const mockData = {
      orderId: 'order-1',
      events: [
        { id: 'e1', fromStatus: null, toStatus: 'Draft', occurredAt: '2026-04-16T10:00:00Z', triggeredBy: 'user' },
      ],
    };
    mockGetOrderHistory.mockResolvedValue(mockData);

    const { result } = renderHook(() => useOrderHistory('order-1'), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(mockGetOrderHistory).toHaveBeenCalledWith('order-1');
  });

  it('does not fetch when orderId is empty', () => {
    const { result } = renderHook(() => useOrderHistory(''), { wrapper: makeWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockGetOrderHistory).not.toHaveBeenCalled();
  });

  it('returns error state on API failure', async () => {
    mockGetOrderHistory.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useOrderHistory('order-1'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
