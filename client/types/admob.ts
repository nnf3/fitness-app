// AdMob関連の型定義

export interface AdMobError {
  code: string;
  message: string;
  details?: unknown;
}

export interface AdMobState {
  isInitialized: boolean;
  isInitializing: boolean;
  error: AdMobError | null;
  lastInitializedAt?: Date;
}

export interface AdMobConfig {
  isProduction: boolean;
  environment?: string;
  bannerUnitId: string;
}

export interface AdMobContextType {
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
  config: AdMobConfig;
  retry: () => void;
}

// 広告タイプの列挙型（将来的な拡張用）
export enum AdType {
  BANNER = 'banner',
  INTERSTITIAL = 'interstitial',
  REWARDED = 'rewarded',
}

// 広告サイズの型定義
export interface AdSize {
  width: number;
  height: number;
}

// 広告リクエストオプションの型定義
export interface AdRequestOptions {
  requestNonPersonalizedAdsOnly?: boolean;
  keywords?: string[];
  contentUrl?: string;
}
