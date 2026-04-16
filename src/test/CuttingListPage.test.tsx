import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CuttingListPage } from '../pages/CuttingListPage';

const mockUseCuttingList = vi.fn();

vi.mock('../hooks/useCuttingList', () => ({
  useCuttingList: () => mockUseCuttingList(),
}));

function renderPage(orderId = 'order-test-id') {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[`/orders/${orderId}/cutting-list`]}>
        <Routes>
          <Route path="/orders/:id/cutting-list" element={<CuttingListPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const mockData = {
  orderId: 'order-test-id',
  items: [
    {
      partCode: 'PC-001',
      description: 'Ajtólap bal',
      widthMm: 900,
      heightMm: 2100,
      quantity: 2,
      material: 'MDF 18mm',
    },
  ],
  totalSheets: 4,
  estimatedWaste: 12.5,
};

describe('CuttingListPage', () => {
  it('shows loading state', () => {
    mockUseCuttingList.mockReturnValue({ isLoading: true, isError: false, data: undefined });
    renderPage();
    expect(screen.getByText('Betöltés...')).toBeInTheDocument();
  });

  it('shows error state on failure', () => {
    mockUseCuttingList.mockReturnValue({ isLoading: false, isError: true, data: undefined });
    renderPage();
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    mockUseCuttingList.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { ...mockData, items: [] },
    });
    renderPage();
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders cutting list table with items', () => {
    mockUseCuttingList.mockReturnValue({ isLoading: false, isError: false, data: mockData });
    renderPage();
    expect(screen.getByTestId('cutting-list-table')).toBeInTheDocument();
    expect(screen.getByText('PC-001')).toBeInTheDocument();
    expect(screen.getByText('Ajtólap bal')).toBeInTheDocument();
    expect(screen.getByText('900 × 2100')).toBeInTheDocument();
  });

  it('shows summary with totalSheets and estimatedWaste', () => {
    mockUseCuttingList.mockReturnValue({ isLoading: false, isError: false, data: mockData });
    renderPage();
    const summary = screen.getByTestId('summary');
    expect(summary).toHaveTextContent('4');
    expect(summary).toHaveTextContent('12.5 %');
  });

  it('renders print and back buttons', () => {
    mockUseCuttingList.mockReturnValue({ isLoading: false, isError: false, data: mockData });
    renderPage();
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
    expect(screen.getByTestId('print-button')).toBeInTheDocument();
  });
});
