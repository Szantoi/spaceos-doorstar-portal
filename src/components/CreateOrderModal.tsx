import { useState } from 'react';
import { useCreateOrder } from '../hooks/useCreateOrder';

interface CreateOrderModalProps {
  onClose: () => void;
}

export function CreateOrderModal({ onClose }: CreateOrderModalProps) {
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  const mutation = useCreateOrder(onClose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reference.length > 100) {
      setValidationError('A referencia maximum 100 karakter lehet.');
      return;
    }
    if (notes.length > 500) {
      setValidationError('A megjegyzés maximum 500 karakter lehet.');
      return;
    }
    setValidationError('');
    mutation.mutate({
      reference: reference.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      data-testid="create-order-modal"
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 id="modal-title" className="text-xl font-semibold text-slate-800 mb-4">
          Új rendelés
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-slate-700 mb-1">
              Referencia <span className="text-slate-400 font-normal">(opcionális)</span>
            </label>
            <input
              id="reference"
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              maxLength={100}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="pl. Kovács ház 2026"
              data-testid="reference-input"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {reference.length}/100
            </p>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
              Megjegyzés <span className="text-slate-400 font-normal">(opcionális)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Egyéb megjegyzések..."
              data-testid="notes-textarea"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {notes.length}/500
            </p>
          </div>

          {validationError && (
            <p className="text-sm text-red-600" data-testid="validation-error">
              {validationError}
            </p>
          )}

          {mutation.isError && (
            <p className="text-sm text-red-600" data-testid="api-error">
              Hiba a rendelés létrehozásakor. Kérjük próbáld újra.
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
              data-testid="cancel-button"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              data-testid="create-button"
            >
              {mutation.isPending && (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              )}
              {mutation.isPending ? 'Létrehozás...' : 'Létrehozás'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
