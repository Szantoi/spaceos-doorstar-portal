import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { OrdersTable } from '../components/OrdersTable';
import { NewOrderModal } from '../components/NewOrderModal';

function OrdersLoadingSkeleton() {
  return (
    <div className="space-y-3" data-testid="loading-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 bg-slate-200 rounded animate-pulse" />
      ))}
    </div>
  );
}

export function OrdersPage() {
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading, isError } = useOrders();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Rendelések</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            data-testid="new-order-btn"
          >
            + Új rendelés
          </button>
        </div>

        {isLoading && <OrdersLoadingSkeleton />}

        {isError && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            Nem sikerült betölteni a rendeléseket. Kérjük próbáld újra.
          </div>
        )}

        {!isLoading && !isError && data && (
          <OrdersTable orders={data.items} />
        )}
      </div>

      {showModal && <NewOrderModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
