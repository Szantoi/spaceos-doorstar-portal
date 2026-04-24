import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrderDetailPage } from '../pages/OrderDetailPage';

const mockUseOrder = vi.fn();

vi.mock('../hooks/useOrder', () => ({
  useOrder: () => mockUseOrder(),
}));

// Stub child components to isolate OrderDetailPage tests
vi.mock('../components/OrderHistoryPanel', () => ({
  OrderHistoryPanel: () => <div data-testid="history-panel-stub" />,
}));

vi.mock('../components/BatchPdfButton', () => ({
  BatchPdfButton: ({ orderId }: { orderId: string }) => (
    <div data-testid="batch-pdf-section">BatchPdf-{orderId.slice(0, 8)}</div>
  ),
}));

vi.mock('../components/AnyaglistaButton', () => ({
  AnyaglistaButton: ({ orderId }: { orderId: string }) => (
    <div data-testid="anyaglista-section">Anyaglista-{orderId.slice(0, 8)}</div>
  ),
}));

vi.mock('../api/ordersApi', () => ({
  ordersApi: {
    submit: vi.fn(),
    calculate: vi.fn(),
  },
  DOOR_TYPES: [
    { id: 'dt-standard-90', label: 'Standard 90cm' },
    { id: 'dt-standard-100', label: 'Standard 100cm' },
    { id: 'dt-double-180', label: 'Dupla szárny 180cm' },
  ],
}));

function renderWithProviders(orderId: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/orders/${orderId}`]}>
        <Routes>
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const mockDraftOrder = {
  id: 'draft-order-uuid-0000-0000-000000000000',
  status: 'Draft' as const,
  createdAt: '2026-04-16T10:00:00Z',
  itemCount: 0,
  totalItems: 0,
  items: [],
};

const mockSubmittedOrder = {
  ...mockDraftOrder,
  status: 'Submitted' as const,
};

describe('OrderDetailPage', () => {
  it('shows loading state', () => {
    mockUseOrder.mockReturnValue({ isLoading: true, isError: false, data: undefined });
    renderWithProviders('draft-order-uuid-0000-0000-000000000000');
    expect(screen.getByText('Betöltés...')).toBeInTheDocument();
  });

  it('shows order id and status for Draft order', () => {
    mockUseOrder.mockReturnValue({ isLoading: false, isError: false, data: mockDraftOrder });
    renderWithProviders('draft-order-uuid-0000-0000-000000000000');
    expect(screen.getByTestId('order-id')).toHaveTextContent('DRAFT-OR');
    expect(screen.getByTestId('status-badge-Draft')).toBeInTheDocument();
  });

  it('shows Beküldés button only for Draft status', () => {
    mockUseOrder.mockReturnValue({ isLoading: false, isError: false, data: mockDraftOrder });
    renderWithProviders('draft-order-uuid-0000-0000-000000000000');
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('hides Beküldés button for Submitted status', () => {
    mockUseOrder.mockReturnValue({ isLoading: false, isError: false, data: mockSubmittedOrder });
    renderWithProviders('draft-order-uuid-0000-0000-000000000000');
    expect(screen.queryByTestId('submit-button')).not.toBeInTheDocument();
  });

  it('shows empty items message when no items', () => {
    mockUseOrder.mockReturnValue({ isLoading: false, isError: false, data: mockDraftOrder });
    renderWithProviders('draft-order-uuid-0000-0000-000000000000');
    expect(screen.getByTestId('no-items')).toBeInTheDocument();
  });

  it('shows items list when order has items', () => {
    const orderWithItems = {
      ...mockDraftOrder,
      items: [{ id: 'item-1', doorTypeId: 'DOOR-TYPE-A', quantity: 3 }],
    };
    mockUseOrder.mockReturnValue({ isLoading: false, isError: false, data: orderWithItems });
    renderWithProviders('draft-order-uuid-0000-0000-000000000000');
    expect(screen.getByTestId('items-list')).toBeInTheDocument();
    expect(screen.getByText('DOOR-TYPE-A')).toBeInTheDocument();
  });

  it('shows back button', () => {
    mockUseOrder.mockReturnValue({ isLoading: false, isError: false, data: mockDraftOrder });
    renderWithProviders('draft-order-uuid-0000-0000-000000000000');
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
  });

  it('shows Dokumentumok section with BatchPdf and Anyaglista buttons', () => {
    mockUseOrder.mockReturnValue({ isLoading: false, isError: false, data: mockDraftOrder });
    renderWithProviders('draft-order-uuid-0000-0000-000000000000');
    expect(screen.getByTestId('documents-section')).toBeInTheDocument();
    expect(screen.getByTestId('batch-pdf-section')).toBeInTheDocument();
    expect(screen.getByTestId('anyaglista-section')).toBeInTheDocument();
  });
});
