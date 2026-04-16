import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrderStatusBadge } from '../components/OrderStatusBadge';

const cases: { status: string; label: string; colorClass: string }[] = [
  { status: 'Draft', label: 'Piszkozat', colorClass: 'bg-gray-100' },
  { status: 'Submitted', label: 'Beküldve', colorClass: 'bg-blue-100' },
  { status: 'InProduction', label: 'Gyártásban', colorClass: 'bg-yellow-100' },
  { status: 'Completed', label: 'Kész', colorClass: 'bg-green-100' },
  { status: 'Done', label: 'Kész', colorClass: 'bg-green-100' },
  { status: 'Cancelled', label: 'Törölve', colorClass: 'bg-red-100' },
];

describe('OrderStatusBadge', () => {
  it.each(cases)('renders correct label and class for $status', ({ status, label, colorClass }) => {
    render(<OrderStatusBadge status={status} />);
    const badge = screen.getByTestId(`status-badge-${status}`);
    expect(badge).toHaveTextContent(label);
    expect(badge.className).toContain(colorClass);
  });

  it('renders fallback for unknown status', () => {
    render(<OrderStatusBadge status="Unknown" />);
    const badge = screen.getByTestId('status-badge-Unknown');
    expect(badge).toHaveTextContent('Ismeretlen');
    expect(badge.className).toContain('bg-slate-100');
  });
});
