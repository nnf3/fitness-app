import { useEffect, useState, useCallback } from 'react';
import { initAds, getAdMobConfig } from '../lib/admob';
import { AdMobContextType } from '../types';

export function useAdMob(): AdMobContextType {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [config] = useState(() => getAdMobConfig());

  const initializeAdMob = useCallback(async () => {
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
    } finally {
      setIsInitializing(false);
    }
  }, [isInitialized, isInitializing]);

  const retry = useCallback(() => {
    setIsInitialized(false);
    setError(null);
    initializeAdMob();
  }, [initializeAdMob]);

  useEffect(() => {
    initializeAdMob();
  }, [initializeAdMob]);

  return {
    isInitialized,
    isInitializing,
    error,
    config,
    retry,
  };
}
