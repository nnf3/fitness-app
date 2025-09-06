import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
  LOG_LEVEL
} from 'react-native-purchases';


// RevenueCatの初期化
export const configureRevenueCat = async () => {
  // デバッグログを有効化
  if (process.env.EXPO_PUBLIC_ENV === 'production' || process.env.EXPO_PUBLIC_ENV === 'preview') {
    Purchases.setLogLevel(LOG_LEVEL.WARN);
  } else {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  const apiKey = Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY
  })
  if (!apiKey) {
    throw new Error('RevenueCat API key is not set');
  }

  Purchases.configure({ apiKey })
};

// ユーザーログイン
export const logInUser = async (appUserId: string) => {
  const { customerInfo } = await Purchases.logIn(appUserId);

  return customerInfo;
};

// ユーザーログアウト
export const logOutUser = async () => {
  const customerInfo = await Purchases.logOut();

  return customerInfo;
};

// オファリングを取得
export const getOfferings = async (): Promise<PurchasesOffering[]> => {
  const offerings = await Purchases.getOfferings();

  return Object.values(offerings.all);
};

// 顧客情報を取得
export const getCustomerInfo = async (): Promise<CustomerInfo> => {
  const customerInfo = await Purchases.getCustomerInfo();

  return customerInfo;
};

// 購入を実行
export const makePurchase = async (packageToPurchase: PurchasesPackage): Promise<CustomerInfo> => {
  const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);

  return customerInfo;
};

// 購入を復元
export const restorePurchases = async (): Promise<CustomerInfo> => {
  const customerInfo = await Purchases.restorePurchases();

  return customerInfo;
};

// エンタイトルメントの確認
export const checkEntitlement = (customerInfo: CustomerInfo, entitlementId: string): boolean => {
  return customerInfo.entitlements.active[entitlementId] !== undefined;
};

// サブスクリプションステータスの確認
export const getSubscriptionStatus = (customerInfo: CustomerInfo, entitlementId: string) => {
  const entitlement = customerInfo.entitlements.active[entitlementId];

  if (!entitlement) {
    return {
      isActive: false,
      willRenew: false,
      periodType: null,
      expirationDate: null,
    };
  }

  return {
    isActive: true,
    willRenew: entitlement.willRenew,
    periodType: entitlement.periodType,
    expirationDate: entitlement.expirationDate,
  };
};
