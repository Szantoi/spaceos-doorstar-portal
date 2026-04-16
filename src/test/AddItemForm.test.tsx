import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddItemForm } from '../components/AddItemForm';
import { ordersApi } from '../api/ordersApi';

vi.mock('../api/ordersApi', () => ({
  ordersApi: { addItem: vi.fn() },
  DOOR_TYPES: [
    { id: 'dt-standard-90', label: 'Standard 90cm' },
    { id: 'dt-standard-100', label: 'Standard 100cm' },
    { id: 'dt-double-180', label: 'Dupla szárny 180cm' },
  ],
}));

const mockAddItem = vi.mocked(ordersApi.addItem);

function renderForm() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <AddItemForm orderId="order-abc" />
    </QueryClientProvider>,
  );
}

describe('AddItemForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders form with door type select and quantity input', () => {
    renderForm();
    expect(screen.getByTestId('add-item-form')).toBeInTheDocument();
    expect(screen.getByTestId('door-type-select')).toBeInTheDocument();
    expect(screen.getByTestId('quantity-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-item-button')).toBeInTheDocument();
  });

  it('renders all door type options', () => {
    renderForm();
    expect(screen.getByText('Standard 90cm')).toBeInTheDocument();
    expect(screen.getByText('Standard 100cm')).toBeInTheDocument();
    expect(screen.getByText('Dupla szárny 180cm')).toBeInTheDocument();
  });

  it('shows validation error when quantity is 0', async () => {
    renderForm();
    fireEvent.change(screen.getByTestId('quantity-input'), { target: { value: '0' } });
    fireEvent.submit(screen.getByTestId('add-item-form'));
    expect(await screen.findByTestId('validation-error')).toBeInTheDocument();
    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it('shows validation error when quantity exceeds 50', async () => {
    renderForm();
    fireEvent.change(screen.getByTestId('quantity-input'), { target: { value: '51' } });
    fireEvent.submit(screen.getByTestId('add-item-form'));
    expect(await screen.findByTestId('validation-error')).toBeInTheDocument();
    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it('calls addItem with correct args on valid submit', async () => {
    mockAddItem.mockResolvedValue(undefined);
    renderForm();
    fireEvent.change(screen.getByTestId('quantity-input'), { target: { value: '3' } });
    fireEvent.submit(screen.getByTestId('add-item-form'));
    await waitFor(() => expect(mockAddItem).toHaveBeenCalledWith('order-abc', {
      doorTypeId: 'dt-standard-90',
      quantity: 3,
    }));
  });

  it('resets quantity to 1 after successful submit', async () => {
    mockAddItem.mockResolvedValue(undefined);
    renderForm();
    fireEvent.change(screen.getByTestId('quantity-input'), { target: { value: '5' } });
    fireEvent.submit(screen.getByTestId('add-item-form'));
    await waitFor(() =>
      expect((screen.getByTestId('quantity-input') as HTMLInputElement).value).toBe('1'),
    );
  });
});
