import { useAnyaglista } from '../hooks/useAnyaglista';

interface AnyaglistaButtonProps {
  orderId: string;
}

export function AnyaglistaButton({ orderId }: AnyaglistaButtonProps) {
  const { download, isLoading, error } = useAnyaglista(orderId);

  return (
    <div className="flex flex-col gap-2" data-testid="anyaglista-section">
      <p className="text-sm font-medium text-slate-700">Anyaglista PDF</p>

      <button
        onClick={download}
        disabled={isLoading}
        className="px-4 py-2 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
        data-testid="anyaglista-download-btn"
      >
        {isLoading ? 'Letöltés...' : 'Letöltés'}
      </button>

      {error && (
        <p className="text-sm text-red-600" data-testid="anyaglista-error">{error}</p>
      )}
    </div>
  );
}
