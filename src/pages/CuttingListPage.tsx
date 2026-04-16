import { useParams, useNavigate } from 'react-router-dom';
import { useCuttingList } from '../hooks/useCuttingList';

export function CuttingListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useCuttingList(id ?? '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center print:hidden">
        <div className="text-slate-500">Betöltés...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-600" data-testid="error-state">
          Nem sikerült betölteni a cutting listát.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Navigation — hidden on print */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <button
            onClick={() => navigate(`/orders/${id}`)}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            data-testid="back-button"
          >
            ← Vissza a rendeléshez
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
            data-testid="print-button"
          >
            Nyomtatás
          </button>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">Cutting Lista</h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">
          Rendelés: {id?.slice(0, 8).toUpperCase()}
        </p>

        {data.items.length === 0 ? (
          <div
            className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500"
            data-testid="empty-state"
          >
            <p>A cutting lista üres.</p>
            <p className="text-sm mt-1">Kalkuláld a rendelést az elemek hozzáadása után.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-slate-200" data-testid="cutting-list-table">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Part kód
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Leírás
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Méret (W×H mm)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Mennyiség
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Anyag
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((item, idx) => (
                  <tr key={`${item.partCode}-${idx}`} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono text-slate-800">{item.partCode}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {item.widthMm} × {item.heightMm}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.quantity} db</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.material}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        <div
          className="bg-white rounded-xl border border-slate-200 p-6 grid grid-cols-2 gap-4"
          data-testid="summary"
        >
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Összes lap</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{data.totalSheets}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Becsült hulladék</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {data.estimatedWaste.toFixed(1)} %
            </p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
