import { useState, useCallback } from 'react';
import { joineryApi } from '../api/joineryApi';

interface UseAnyaglistaReturn {
  download: () => void;
  isLoading: boolean;
  error: string | null;
}

export function useAnyaglista(orderId: string): UseAnyaglistaReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const blob = await joineryApi.downloadAnyaglista([orderId]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anyaglista-${orderId.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError('Nem sikerült letölteni az anyaglistát.');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  return { download, isLoading, error };
}
