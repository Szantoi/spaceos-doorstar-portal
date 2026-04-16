import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CreateOrderModal } from '../components/CreateOrderModal';
import { ordersApi } from '../api/ordersApi';

vi.mock('../api/ordersApi', () => ({
  ordersApi: { createOrder: vi.fn() },
  DOOR_TYPES: [],
}));

const mockCreateOrder = vi.mocked(ordersApi.createOrder);
const mockOnClose = vi.fn();

function renderModal() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <CreateOrderModal onClose={mockOnClose} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('CreateOrderModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with reference input, notes textarea and buttons', () => {
    renderModal();
    expect(screen.getByTestId('create-order-modal')).toBeInTheDocument();
    expect(screen.getByTestId('reference-input')).toBeInTheDocument();
    expect(screen.getByTestId('notes-textarea')).toBeInTheDocument();
    expect(screen.getByTestId('create-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
  });

  it('calls onClose when cancel button clicked', () => {
    renderModal();
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop clicked', () => {
    renderModal();
    fireEvent.click(screen.getByTestId('create-order-modal'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows validation error when reference exceeds 100 chars', async () => {
    renderModal();
    fireEvent.change(screen.getByTestId('reference-input'), {
      target: { value: 'a'.repeat(101) },
    });
    fireEvent.submit(screen.getByTestId('create-order-modal').querySelector('form')!);
    expect(await screen.findByTestId('validation-error')).toBeInTheDocument();
    expect(mockCreateOrder).not.toHaveBeenCalled();
  });

  it('shows validation error when notes exceeds 500 chars', async () => {
    renderModal();
    fireEvent.change(screen.getByTestId('notes-textarea'), {
      target: { value: 'a'.repeat(501) },
    });
    fireEvent.submit(screen.getByTestId('create-order-modal').querySelector('form')!);
    expect(await screen.findByTestId('validation-error')).toBeInTheDocument();
    expect(mockCreateOrder).not.toHaveBeenCalled();
  });

  it('calls createOrder with correct data on valid submit', async () => {
    mockCreateOrder.mockResolvedValue({
      id: 'new-order-id',
      status: 'Draft',
      createdAt: '2026-04-16T10:00:00Z',
      itemCount: 0,
      totalItems: 0,
    });
    renderModal();
    fireEvent.change(screen.getByTestId('reference-input'), {
      target: { value: 'Kovács ház 2026' },
    });
    fireEvent.change(screen.getByTestId('notes-textarea'), {
      target: { value: 'Sürgős' },
    });
    fireEvent.submit(screen.getByTestId('create-order-modal').querySelector('form')!);
    await waitFor(() =>
      expect(mockCreateOrder).toHaveBeenCalledWith({
        reference: 'Kovács ház 2026',
        notes: 'Sürgős',
      }),
    );
  });

  it('shows API error message on mutation failure', async () => {
    mockCreateOrder.mockRejectedValue(new Error('Server error'));
    renderModal();
    fireEvent.submit(screen.getByTestId('create-order-modal').querySelector('form')!);
    expect(await screen.findByTestId('api-error')).toBeInTheDocument();
  });

  it('create button is disabled while loading', async () => {
    // Never resolves to stay in loading state
    mockCreateOrder.mockImplementation(() => new Promise(() => {}));
    renderModal();
    fireEvent.submit(screen.getByTestId('create-order-modal').querySelector('form')!);
    await waitFor(() =>
      expect(screen.getByTestId('create-button')).toBeDisabled(),
    );
  });

  it('submit without inputs calls createOrder with undefined values', async () => {
    mockCreateOrder.mockResolvedValue({
      id: 'order-id-2',
      status: 'Draft',
      createdAt: '2026-04-16T10:00:00Z',
      itemCount: 0,
      totalItems: 0,
    });
    renderModal();
    fireEvent.submit(screen.getByTestId('create-order-modal').querySelector('form')!);
    await waitFor(() =>
      expect(mockCreateOrder).toHaveBeenCalledWith({
        reference: undefined,
        notes: undefined,
      }),
    );
  });
});
