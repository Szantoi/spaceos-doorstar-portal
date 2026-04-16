import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import type { OrderStatus } from '../api/ordersApi';

const cases: { status: OrderStatus; label: string; colorClass: string }[] = [
  { status: 'Draft', label: 'Piszkozat', colorClass: 'bg-slate-100' },
  { status: 'Submitted', label: 'Beküldve', colorClass: 'bg-blue-100' },
  { status: 'InProduction', label: 'Gyártásban', colorClass: 'bg-yellow-100' },
  { status: 'Completed', label: 'Kész', colorClass: 'bg-green-100' },
  { status: 'Cancelled', label: 'Törölve', colorClass: 'bg-red-100' },
];

describe('OrderStatusBadge', () => {
  it.each(cases)('renders correct label and class for $status', ({ status, label, colorClass }) => {
    render(<OrderStatusBadge status={status} />);
    const badge = screen.getByTestId(`status-badge-${status}`);
    expect(badge).toHaveTextContent(label);
    expect(badge.className).toContain(colorClass);
  });
});
