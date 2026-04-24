import { useState, useCallback, useRef, useEffect } from 'react';
import { joineryApi } from '../api/joineryApi';
import type { BatchStatus } from '../api/joineryApi';

const POLL_INTERVAL_MS = 2000;

interface UseBatchPdfReturn {
  status: BatchStatus | 'Idle';
  start: () => void;
  download: () => void;
  error: string | null;
}

export function useBatchPdf(orderId: string): UseBatchPdfReturn {
  const [status, setStatus] = useState<BatchStatus | 'Idle'>('Idle');
  const [batchId, setBatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const poll = useCallback(
    (id: string) => {
      timerRef.current = setInterval(async () => {
        try {
          const res = await joineryApi.getBatchStatus(id);
          setStatus(res.status);

          if (res.status === 'Ready' || res.status === 'Failed') {
            stopPolling();
            if (res.status === 'Failed') {
              setError('A gyártásilap generálás sikertelen.');
            }
          }
        } catch {
          stopPolling();
          setStatus('Failed');
          setError('Hiba a státusz lekérdezésnél.');
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling],
  );

  const start = useCallback(async () => {
    setError(null);
    setStatus('Pending');
    try {
      const res = await joineryApi.createBatch([orderId]);
      setBatchId(res.id);
      setStatus(res.status);
      poll(res.id);
    } catch {
      setStatus('Failed');
      setError('Nem sikerült elindítani a generálást.');
    }
  }, [orderId, poll]);

  const download = useCallback(() => {
    if (batchId) {
      joineryApi.downloadBatch(batchId);
    }
  }, [batchId]);

  return { status, start, download, error };
}
