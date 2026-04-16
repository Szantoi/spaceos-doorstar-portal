import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

interface NewOrderModalProps {
  onClose: () => void;
}

export function NewOrderModal({ onClose }: NewOrderModalProps) {
  const [customerId, setCustomerId] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => ordersApi.create(customerId),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate(`/orders/${order.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerId.trim()) {
      mutation.mutate();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
        data-testid="new-order-modal"
      >
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Új rendelés</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customerId" className="block text-sm font-medium text-slate-700 mb-1">
              Vevő azonosító
            </label>
            <input
              id="customerId"
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="pl. CUST-001"
              required
            />
          </div>
          {mutation.isError && (
            <p className="text-sm text-red-600">Hiba történt. Kérjük próbáld újra.</p>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              data-testid="create-order-button"
            >
              {mutation.isPending ? 'Létrehozás...' : 'Létrehozás'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
