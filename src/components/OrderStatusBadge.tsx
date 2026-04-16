import type { OrderStatus } from '../api/ordersApi';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  Draft: { label: 'Piszkozat', className: 'bg-slate-100 text-slate-700' },
  Submitted: { label: 'Beküldve', className: 'bg-blue-100 text-blue-700' },
  InProduction: { label: 'Gyártásban', className: 'bg-yellow-100 text-yellow-700' },
  Completed: { label: 'Kész', className: 'bg-green-100 text-green-700' },
  Cancelled: { label: 'Törölve', className: 'bg-red-100 text-red-700' },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
      data-testid={`status-badge-${status}`}
    >
      {config.label}
    </span>
  );
}
