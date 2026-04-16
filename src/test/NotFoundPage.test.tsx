import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';

describe('NotFoundPage', () => {
  it('renders 404 text', () => {
    render(<MemoryRouter><NotFoundPage /></MemoryRouter>);
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders "Az oldal nem található" heading', () => {
    render(<MemoryRouter><NotFoundPage /></MemoryRouter>);
    expect(screen.getByText('Az oldal nem található')).toBeInTheDocument();
  });

  it('renders back-to-home link pointing to /orders', () => {
    render(<MemoryRouter><NotFoundPage /></MemoryRouter>);
    const link = screen.getByTestId('back-to-home-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/orders');
  });
});
