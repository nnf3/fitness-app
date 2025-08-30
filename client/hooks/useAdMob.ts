import { useEffect, useState } from 'react';
import { initAds, getAdMobConfig } from '../lib/admob';

interface UseAdMobReturn {
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
  config: ReturnType<typeof getAdMobConfig>;
}

export function useAdMob(): UseAdMobReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [config] = useState(() => getAdMobConfig());

  useEffect(() => {
    const initializeAdMob = async () => {
      if (isInitialized || isInitializing) {
        return;
      }

      setIsInitializing(true);
      setError(null);

      try {
        await initAds();
        setIsInitialized(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown AdMob initialization error');
        console.error('AdMob initialization error:', error);
        setError(error);
        // エラーが発生してもアプリは継続して動作
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAdMob();
  }, [isInitialized, isInitializing]);

  return {
    isInitialized,
    isInitializing,
    error,
    config,
  };
}
