import { useBatchPdf } from '../hooks/useBatchPdf';

interface BatchPdfButtonProps {
  orderId: string;
}

export function BatchPdfButton({ orderId }: BatchPdfButtonProps) {
  const { status, start, download, error } = useBatchPdf(orderId);

  const isPolling = status === 'Pending' || status === 'Generating';

  return (
    <div className="flex flex-col gap-2" data-testid="batch-pdf-section">
      <p className="text-sm font-medium text-slate-700">Gyártásilap PDF</p>

      {status === 'Idle' && (
        <button
          onClick={start}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          data-testid="batch-pdf-generate-btn"
        >
          Generálás
        </button>
      )}

      {isPolling && (
        <div className="flex items-center gap-2 text-sm text-blue-600" data-testid="batch-pdf-polling">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generálás folyamatban...
        </div>
      )}

      {status === 'Ready' && (
        <button
          onClick={download}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          data-testid="batch-pdf-download-btn"
        >
          Letöltés
        </button>
      )}

      {status === 'Failed' && (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-red-600" data-testid="batch-pdf-error">{error}</p>
          <button
            onClick={start}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="batch-pdf-retry-btn"
          >
            Újrapróbálás
          </button>
        </div>
      )}
    </div>
  );
}
