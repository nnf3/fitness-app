import React, { createContext, useContext, ReactNode } from 'react';
import { useAdMob } from '../hooks';
import { AdMobContextType } from '../types';

const AdMobContext = createContext<AdMobContextType | undefined>(undefined);

interface AdMobProviderProps {
  children: ReactNode;
}

export function AdMobProvider({ children }: AdMobProviderProps) {
  const adMobState = useAdMob();

  return (
    <AdMobContext.Provider value={adMobState}>
      {children}
    </AdMobContext.Provider>
  );
}

export function useAdMobContext(): AdMobContextType {
  const context = useContext(AdMobContext);
  if (context === undefined) {
    throw new Error('useAdMobContext must be used within an AdMobProvider');
  }
  return context;
}
