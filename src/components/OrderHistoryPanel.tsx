import { useOrderHistory } from '../hooks/useOrderHistory';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderHistoryPanelProps {
  orderId: string;
}

function HistorySkeleton() {
  return (
    <div className="space-y-4" data-testid="history-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-16 h-5 bg-slate-200 rounded-full animate-pulse" />
          <div className="flex-1 h-4 bg-slate-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function formatEventDate(iso: string): string {
  return new Intl.DateTimeFormat('hu-HU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function OrderHistoryPanel({ orderId }: OrderHistoryPanelProps) {
  const { data, isLoading, isError } = useOrderHistory(orderId);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Státusz történet</h2>

      {isLoading && <HistorySkeleton />}

      {isError && (
        <p className="text-sm text-red-600" data-testid="history-error">
          Nem sikerült betölteni a történetet.
        </p>
      )}

      {!isLoading && !isError && data?.events.length === 0 && (
        <p className="text-sm text-slate-500" data-testid="history-empty">
          Nincs státusz történet.
        </p>
      )}

      {!isLoading && !isError && data && data.events.length > 0 && (
        <ol className="relative border-l border-slate-200 ml-2 space-y-4" data-testid="history-list">
          {data.events.map((event) => (
            <li key={event.id} className="ml-4">
              <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white" />
              <div className="flex flex-wrap items-center gap-2">
                <OrderStatusBadge status={event.toStatus} />
                <time
                  dateTime={event.occurredAt}
                  className="text-xs text-slate-500"
                  data-testid={`history-date-${event.id}`}
                >
                  {formatEventDate(event.occurredAt)}
                </time>
                <span className="text-xs text-slate-400">· {event.triggeredBy}</span>
              </div>
              {event.note && (
                <p className="text-xs text-slate-500 mt-1 ml-0">{event.note}</p>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
