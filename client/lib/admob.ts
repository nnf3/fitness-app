import mobileAds, { TestIds, MaxAdContentRating } from 'react-native-google-mobile-ads';

// 環境変数の取得
const env = process.env.EXPO_PUBLIC_ENV; // 'development' | 'preview' | 'production' など
export const IS_PROD = env === 'production';

// バナー広告ユニットIDの設定
export const BANNER_UNIT_ID = IS_PROD
  ? process.env.ADMOB_IOS_BANNER_UNIT_ID!
  : TestIds.BANNER; // dev/preview では必ずテスト広告

// AdMobの初期化関数
export async function initAds() {
  try {
    // リクエスト設定
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.PG,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });

    // AdMobの初期化
    await mobileAds().initialize();
  } catch (error) {
    throw error;
  }
}

// 環境情報を取得するヘルパー関数
export function getAdMobConfig() {
  return {
    isProduction: IS_PROD,
    environment: env,
    bannerUnitId: BANNER_UNIT_ID,
  };
}
