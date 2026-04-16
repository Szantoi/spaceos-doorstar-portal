import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, DOOR_TYPES } from '../api/ordersApi';

interface AddItemFormProps {
  orderId: string;
}

export function AddItemForm({ orderId }: AddItemFormProps) {
  const [doorTypeId, setDoorTypeId] = useState<string>(DOOR_TYPES[0].id);
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => ordersApi.addItem(orderId, { doorTypeId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
      setQuantity(1);
      setValidationError('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity < 1 || quantity > 50) {
      setValidationError('A mennyiség 1 és 50 között kell legyen.');
      return;
    }
    setValidationError('');
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" data-testid="add-item-form">
      <h3 className="text-sm font-semibold text-slate-700">Tétel hozzáadása</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="doorType" className="block text-xs text-slate-500 mb-1">
            Ajtó típus
          </label>
          <select
            id="doorType"
            value={doorTypeId}
            onChange={(e) => setDoorTypeId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="door-type-select"
          >
            {DOOR_TYPES.map((dt) => (
              <option key={dt.id} value={dt.id}>
                {dt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-32">
          <label htmlFor="quantity" className="block text-xs text-slate-500 mb-1">
            Mennyiség
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={50}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="quantity-input"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            data-testid="add-item-button"
          >
            {mutation.isPending ? 'Hozzáadás...' : '+ Tétel hozzáadása'}
          </button>
        </div>
      </div>
      {validationError && (
        <p className="text-xs text-red-600" data-testid="validation-error">{validationError}</p>
      )}
      {mutation.isError && (
        <p className="text-xs text-red-600">Hiba a tétel hozzáadásakor.</p>
      )}
    </form>
  );
}
