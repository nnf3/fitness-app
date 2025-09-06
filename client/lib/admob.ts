import mobileAds, { TestIds, MaxAdContentRating } from 'react-native-google-mobile-ads';
import * as Tracking from 'expo-tracking-transparency';

// 環境変数の取得
const env = process.env.EXPO_PUBLIC_ENV; // 'development' | 'preview' | 'production' など
export const IS_PROD = env === 'production';

// バナー広告ユニットIDの設定
export const BANNER_UNIT_ID = IS_PROD
  ? process.env.ADMOB_IOS_BANNER_UNIT_ID!
  : TestIds.BANNER; // dev/preview では必ずテスト広告

// トラッキング許可の確認（既に決まっている場合はリクエストしない）
export async function getTrackingPermission(): Promise<boolean> {
  try {
    // まず現在の許可状態を確認
    const { status } = await Tracking.getTrackingPermissionsAsync();

    // 既に許可または拒否が決まっている場合はその状態を返す
    if (status === Tracking.PermissionStatus.GRANTED || status === Tracking.PermissionStatus.DENIED) {
      return status === Tracking.PermissionStatus.GRANTED;
    }

    // まだ決まっていない場合のみリクエスト
    if (status === Tracking.PermissionStatus.UNDETERMINED) {
      const { status: requestStatus } = await Tracking.requestTrackingPermissionsAsync();
      return requestStatus === Tracking.PermissionStatus.GRANTED;
    }

    // その他の状態（restricted等）は許可されていないとみなす
    return false;
  } catch (error) {
    console.error('Failed to get/request tracking permission:', error);
    return false;
  }
}

// AdMobの初期化関数
export async function initAds(): Promise<boolean> {
  try {
    // トラッキング許可を確認
    const isTrackingAllowed = await getTrackingPermission();

    // リクエスト設定
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.PG,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });

    // AdMobの初期化
    await mobileAds().initialize();

    return isTrackingAllowed;
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
