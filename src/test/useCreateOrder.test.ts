import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { ordersApi } from '../api/ordersApi';

vi.mock('../api/ordersApi', () => ({
  ordersApi: { createOrder: vi.fn() },
  DOOR_TYPES: [],
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockCreateOrder = vi.mocked(ordersApi.createOrder);

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: qc },
      createElement(MemoryRouter, null, children),
    );
}

describe('useCreateOrder', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls createOrder with given input', async () => {
    mockCreateOrder.mockResolvedValue({
      id: 'order-xyz',
      status: 'Draft',
      createdAt: '2026-04-16T10:00:00Z',
      itemCount: 0,
      totalItems: 0,
    });

    const { result } = renderHook(() => useCreateOrder(), { wrapper: makeWrapper() });

    act(() => {
      result.current.mutate({ reference: 'Test ref', notes: 'Some notes' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockCreateOrder).toHaveBeenCalledWith({ reference: 'Test ref', notes: 'Some notes' });
  });

  it('navigates to new order after success', async () => {
    mockCreateOrder.mockResolvedValue({
      id: 'order-nav-id',
      status: 'Draft',
      createdAt: '2026-04-16T10:00:00Z',
      itemCount: 0,
      totalItems: 0,
    });

    const { result } = renderHook(() => useCreateOrder(), { wrapper: makeWrapper() });

    act(() => { result.current.mutate({}); });

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/orders/order-nav-id'));
  });

  it('calls onSuccess callback after successful mutation', async () => {
    const onSuccess = vi.fn();
    mockCreateOrder.mockResolvedValue({
      id: 'order-cb',
      status: 'Draft',
      createdAt: '2026-04-16T10:00:00Z',
      itemCount: 0,
      totalItems: 0,
    });

    const { result } = renderHook(() => useCreateOrder(onSuccess), { wrapper: makeWrapper() });

    act(() => { result.current.mutate({}); });

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });

  it('exposes error state on API failure', async () => {
    mockCreateOrder.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useCreateOrder(), { wrapper: makeWrapper() });

    act(() => { result.current.mutate({}); });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
