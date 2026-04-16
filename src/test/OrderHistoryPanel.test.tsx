import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrderHistoryPanel } from '../components/OrderHistoryPanel';

const mockUseOrderHistory = vi.fn();

vi.mock('../hooks/useOrderHistory', () => ({
  useOrderHistory: () => mockUseOrderHistory(),
}));

function renderPanel(orderId = 'order-test') {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <OrderHistoryPanel orderId={orderId} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const mockEvents = [
  {
    id: 'evt-1',
    fromStatus: null,
    toStatus: 'Draft',
    occurredAt: '2026-04-16T10:00:00Z',
    triggeredBy: 'Teszt Elek',
    note: undefined,
  },
  {
    id: 'evt-2',
    fromStatus: 'Draft',
    toStatus: 'Submitted',
    occurredAt: '2026-04-16T11:30:00Z',
    triggeredBy: 'system',
  },
];

describe('OrderHistoryPanel', () => {
  it('shows loading skeleton while fetching', () => {
    mockUseOrderHistory.mockReturnValue({ isLoading: true, isError: false, data: undefined });
    renderPanel();
    expect(screen.getByTestId('history-skeleton')).toBeInTheDocument();
  });

  it('shows error message on failure', () => {
    mockUseOrderHistory.mockReturnValue({ isLoading: false, isError: true, data: undefined });
    renderPanel();
    expect(screen.getByTestId('history-error')).toBeInTheDocument();
  });

  it('shows empty state when no events', () => {
    mockUseOrderHistory.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { orderId: 'order-test', events: [] },
    });
    renderPanel();
    expect(screen.getByTestId('history-empty')).toBeInTheDocument();
    expect(screen.getByText('Nincs státusz történet.')).toBeInTheDocument();
  });

  it('renders history events list', () => {
    mockUseOrderHistory.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { orderId: 'order-test', events: mockEvents },
    });
    renderPanel();
    expect(screen.getByTestId('history-list')).toBeInTheDocument();
    expect(screen.getByTestId('status-badge-Draft')).toBeInTheDocument();
    expect(screen.getByTestId('status-badge-Submitted')).toBeInTheDocument();
  });

  it('renders triggeredBy for each event', () => {
    mockUseOrderHistory.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { orderId: 'order-test', events: mockEvents },
    });
    renderPanel();
    expect(screen.getByText(/Teszt Elek/)).toBeInTheDocument();
    expect(screen.getByText(/system/)).toBeInTheDocument();
  });

  it('renders localized date for events', () => {
    mockUseOrderHistory.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { orderId: 'order-test', events: [mockEvents[0]] },
    });
    renderPanel();
    // hu-HU formatted date contains year 2026
    const dateEl = screen.getByTestId('history-date-evt-1');
    expect(dateEl.textContent).toMatch(/2026/);
  });
});
