import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrder } from '../hooks/useOrder';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { AddItemForm } from '../components/AddItemForm';
import { OrderHistoryPanel } from '../components/OrderHistoryPanel';
import { BatchPdfButton } from '../components/BatchPdfButton';
import { AnyaglistaButton } from '../components/AnyaglistaButton';
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

  const calculateMutation = useMutation({
    mutationFn: () => ordersApi.calculate(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
      queryClient.invalidateQueries({ queryKey: ['cutting-list', id] });
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

  const isDraft = order.status === 'Draft';
  const hasItems = order.items.length > 0;

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

        {/* Header card */}
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

          {isDraft && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
              <button
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                data-testid="submit-button"
              >
                {submitMutation.isPending ? 'Beküldés...' : 'Beküldés'}
              </button>
              <button
                onClick={() => calculateMutation.mutate()}
                disabled={calculateMutation.isPending || !hasItems}
                className="px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
                data-testid="calculate-button"
              >
                {calculateMutation.isPending ? 'Kalkulálás...' : 'Kalkulálás'}
              </button>
              {submitMutation.isError && (
                <p className="w-full text-sm text-red-600">Hiba a beküldésnél.</p>
              )}
              {calculateMutation.isError && (
                <p className="w-full text-sm text-red-600">Hiba a kalkulációnál.</p>
              )}
            </div>
          )}
        </div>

        {/* Items card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Tételek ({order.items.length})
          </h2>
          {order.items.length === 0 ? (
            <p className="text-slate-500 text-sm" data-testid="no-items">Nincs tétel.</p>
          ) : (
            <ul className="divide-y divide-slate-100 mb-4" data-testid="items-list">
              {order.items.map((item) => (
                <li key={item.id} className="py-3 flex items-center justify-between text-sm">
                  <span className="text-slate-700 font-mono">{item.doorTypeId}</span>
                  <span className="text-slate-500">× {item.quantity} db</span>
                </li>
              ))}
            </ul>
          )}

          {isDraft && <AddItemForm orderId={id!} />}
        </div>

        {/* Dokumentumok */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6" data-testid="documents-section">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Dokumentumok</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BatchPdfButton orderId={id!} />
            <AnyaglistaButton orderId={id!} />
          </div>
        </div>

        {/* Status history */}
        <div className="mb-6">
          <OrderHistoryPanel orderId={id!} />
        </div>

        {/* Cutting list link */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Cutting lista</h2>
              <p className="text-sm text-slate-500 mt-1">
                Kalkuláció után megtekinthető a részletes szabáslista.
              </p>
            </div>
            <Link
              to={`/orders/${id}/cutting-list`}
              className="px-4 py-2 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
              data-testid="cutting-list-link"
            >
              Cutting lista megtekintése →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
