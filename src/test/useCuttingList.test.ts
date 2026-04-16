import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useCuttingList } from '../hooks/useCuttingList';
import { ordersApi } from '../api/ordersApi';

vi.mock('../api/ordersApi', () => ({
  ordersApi: { getCuttingList: vi.fn() },
  DOOR_TYPES: [
    { id: 'dt-standard-90', label: 'Standard 90cm' },
  ],
}));

const mockGetCuttingList = vi.mocked(ordersApi.getCuttingList);

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children);
}

describe('useCuttingList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches cutting list for given orderId', async () => {
    const mockData = {
      orderId: 'order-1',
      items: [],
      totalSheets: 0,
      estimatedWaste: 0,
    };
    mockGetCuttingList.mockResolvedValue(mockData);

    const { result } = renderHook(() => useCuttingList('order-1'), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(mockGetCuttingList).toHaveBeenCalledWith('order-1');
  });

  it('does not fetch when orderId is empty', () => {
    const { result } = renderHook(() => useCuttingList(''), { wrapper: makeWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockGetCuttingList).not.toHaveBeenCalled();
  });

  it('returns error state on API failure', async () => {
    mockGetCuttingList.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useCuttingList('order-1'), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
