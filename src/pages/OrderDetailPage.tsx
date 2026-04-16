import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrder } from '../hooks/useOrder';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { ordersApi } from '../api/ordersApi';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: order, isLoading, isError } = useOrder(id ?? '');

  const submitMutation = useMutation({
    mutationFn: () => ordersApi.submit(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Betöltés...</div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-600">Nem sikerült betölteni a rendelést.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
          data-testid="back-button"
        >
          ← Vissza a rendelésekhez
        </button>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800 font-mono" data-testid="order-id">
                {order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Létrehozva: {new Date(order.createdAt).toLocaleDateString('hu-HU')}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          {order.status === 'Draft' && (
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                data-testid="submit-button"
              >
                {submitMutation.isPending ? 'Beküldés...' : 'Beküldés'}
              </button>
              {submitMutation.isError && (
                <p className="mt-2 text-sm text-red-600">Hiba a beküldésnél.</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Tételek ({order.items.length})
          </h2>
          {order.items.length === 0 ? (
            <p className="text-slate-500 text-sm" data-testid="no-items">Nincs tétel.</p>
          ) : (
            <ul className="divide-y divide-slate-100" data-testid="items-list">
              {order.items.map((item) => (
                <li key={item.id} className="py-3 flex items-center justify-between text-sm">
                  <span className="text-slate-700 font-mono">{item.doorTypeId}</span>
                  <span className="text-slate-500">× {item.quantity} db</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
