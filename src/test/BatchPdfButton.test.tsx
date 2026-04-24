import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BatchPdfButton } from '../components/BatchPdfButton';

const mockStart = vi.fn();
const mockDownload = vi.fn();
const mockUseBatchPdf = vi.fn();

vi.mock('../hooks/useBatchPdf', () => ({
  useBatchPdf: (...args: unknown[]) => mockUseBatchPdf(...args),
}));

describe('BatchPdfButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Generálás button in Idle state', () => {
    mockUseBatchPdf.mockReturnValue({ status: 'Idle', start: mockStart, download: mockDownload, error: null });
    render(<BatchPdfButton orderId="order-123" />);
    expect(screen.getByTestId('batch-pdf-generate-btn')).toBeInTheDocument();
    expect(screen.getByText('Generálás')).toBeInTheDocument();
  });

  it('calls start on Generálás button click', async () => {
    mockUseBatchPdf.mockReturnValue({ status: 'Idle', start: mockStart, download: mockDownload, error: null });
    render(<BatchPdfButton orderId="order-123" />);
    await userEvent.click(screen.getByTestId('batch-pdf-generate-btn'));
    expect(mockStart).toHaveBeenCalled();
  });

  it('shows spinner during Generating status', () => {
    mockUseBatchPdf.mockReturnValue({ status: 'Generating', start: mockStart, download: mockDownload, error: null });
    render(<BatchPdfButton orderId="order-123" />);
    expect(screen.getByTestId('batch-pdf-polling')).toBeInTheDocument();
    expect(screen.getByText('Generálás folyamatban...')).toBeInTheDocument();
  });

  it('shows Letöltés button when Ready', () => {
    mockUseBatchPdf.mockReturnValue({ status: 'Ready', start: mockStart, download: mockDownload, error: null });
    render(<BatchPdfButton orderId="order-123" />);
    expect(screen.getByTestId('batch-pdf-download-btn')).toBeInTheDocument();
    expect(screen.getByText('Letöltés')).toBeInTheDocument();
  });

  it('shows error message when Failed', () => {
    mockUseBatchPdf.mockReturnValue({
      status: 'Failed', start: mockStart, download: mockDownload,
      error: 'A gyártásilap generálás sikertelen.',
    });
    render(<BatchPdfButton orderId="order-123" />);
    expect(screen.getByTestId('batch-pdf-error')).toBeInTheDocument();
    expect(screen.getByTestId('batch-pdf-retry-btn')).toBeInTheDocument();
  });
});
