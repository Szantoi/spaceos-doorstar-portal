import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrdersPage } from '../pages/OrdersPage';

const mockUseOrders = vi.fn();

vi.mock('../hooks/useOrders', () => ({
  useOrders: () => mockUseOrders(),
}));

// Stub CreateOrderModal to avoid hook/navigate complexity in page tests
vi.mock('../components/CreateOrderModal', () => ({
  CreateOrderModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="create-order-modal">
      <button onClick={onClose} data-testid="modal-close">Bezár</button>
    </div>
  ),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('OrdersPage', () => {
  it('shows loading skeleton while fetching', () => {
    mockUseOrders.mockReturnValue({ isLoading: true, isError: false, data: undefined });
    renderWithProviders(<OrdersPage />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('shows empty state when no orders', () => {
    mockUseOrders.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { items: [], totalCount: 0, page: 1, pageSize: 20 },
    });
    renderWithProviders(<OrdersPage />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('Még nincs rendelés')).toBeInTheDocument();
  });

  it('renders orders table when data is loaded', () => {
    mockUseOrders.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        items: [
          {
            id: 'abc12345-0000-0000-0000-000000000000',
            status: 'Draft',
            createdAt: '2026-04-16T10:00:00Z',
            itemCount: 2,
            totalItems: 2,
          },
        ],
        totalCount: 1,
        page: 1,
        pageSize: 20,
      },
    });
    renderWithProviders(<OrdersPage />);
    expect(screen.getByTestId('orders-table')).toBeInTheDocument();
    expect(screen.getByText('ABC12345')).toBeInTheDocument();
  });

  it('shows new order button', () => {
    mockUseOrders.mockReturnValue({ isLoading: false, isError: false, data: { items: [], totalCount: 0, page: 1, pageSize: 20 } });
    renderWithProviders(<OrdersPage />);
    expect(screen.getByTestId('new-order-btn')).toBeInTheDocument();
  });

  it('opens CreateOrderModal when new order button is clicked', () => {
    mockUseOrders.mockReturnValue({ isLoading: false, isError: false, data: { items: [], totalCount: 0, page: 1, pageSize: 20 } });
    renderWithProviders(<OrdersPage />);
    expect(screen.queryByTestId('create-order-modal')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('new-order-btn'));
    expect(screen.getByTestId('create-order-modal')).toBeInTheDocument();
  });

  it('closes modal when onClose is called', () => {
    mockUseOrders.mockReturnValue({ isLoading: false, isError: false, data: { items: [], totalCount: 0, page: 1, pageSize: 20 } });
    renderWithProviders(<OrdersPage />);
    fireEvent.click(screen.getByTestId('new-order-btn'));
    expect(screen.getByTestId('create-order-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('modal-close'));
    expect(screen.queryByTestId('create-order-modal')).not.toBeInTheDocument();
  });

  it('shows error message on fetch failure', () => {
    mockUseOrders.mockReturnValue({ isLoading: false, isError: true, data: undefined });
    renderWithProviders(<OrdersPage />);
    expect(screen.getByText(/Nem sikerült betölteni/)).toBeInTheDocument();
  });
});
