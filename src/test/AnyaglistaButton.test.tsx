import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnyaglistaButton } from '../components/AnyaglistaButton';

const mockDownload = vi.fn();
const mockUseAnyaglista = vi.fn();

vi.mock('../hooks/useAnyaglista', () => ({
  useAnyaglista: (...args: unknown[]) => mockUseAnyaglista(...args),
}));

describe('AnyaglistaButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Letöltés button', () => {
    mockUseAnyaglista.mockReturnValue({ download: mockDownload, isLoading: false, error: null });
    render(<AnyaglistaButton orderId="order-456" />);
    expect(screen.getByTestId('anyaglista-download-btn')).toBeInTheDocument();
    expect(screen.getByText('Letöltés')).toBeInTheDocument();
  });

  it('calls download on button click', async () => {
    mockUseAnyaglista.mockReturnValue({ download: mockDownload, isLoading: false, error: null });
    render(<AnyaglistaButton orderId="order-456" />);
    await userEvent.click(screen.getByTestId('anyaglista-download-btn'));
    expect(mockDownload).toHaveBeenCalled();
  });

  it('shows error message on failure', () => {
    mockUseAnyaglista.mockReturnValue({
      download: mockDownload, isLoading: false,
      error: 'Nem sikerült letölteni az anyaglistát.',
    });
    render(<AnyaglistaButton orderId="order-456" />);
    expect(screen.getByTestId('anyaglista-error')).toBeInTheDocument();
  });
});
