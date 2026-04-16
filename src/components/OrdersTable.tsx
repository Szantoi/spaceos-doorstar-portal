import { Link } from 'react-router-dom';
import type { DoorOrder } from '../api/ordersApi';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrdersTableProps {
  orders: DoorOrder[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-slate-500"
        data-testid="empty-state"
      >
        <p className="text-lg">Még nincs rendelés</p>
        <p className="text-sm mt-1">Hozd létre az első rendelést a + Új rendelés gombbal.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200" data-testid="orders-table">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Rendelés ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Státusz
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Létrehozva
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Tételek
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  to={`/orders/${order.id}`}
                  className="text-blue-600 hover:text-blue-800 font-mono text-sm"
                >
                  {order.id.slice(0, 8).toUpperCase()}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                {new Date(order.createdAt).toLocaleDateString('hu-HU')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                {order.itemCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
