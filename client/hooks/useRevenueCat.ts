import { useState, useCallback } from 'react';
import { PurchasesPackage } from 'react-native-purchases';
import {
  makePurchase,
  restorePurchases
} from '../lib/revenuecat';
import { useAuth } from './AuthContext';

export const useRevenueCat = () => {
  const {
    customerInfo,
    offerings,
    revenueCatLoading,
    revenueCatError,
    refreshCustomerInfo,
    refreshOfferings,
    isEntitled,
    getSubscriptionInfo,
  } = useAuth();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // 購入処理
  const purchasePackage = useCallback(async (packageToPurchase: PurchasesPackage) => {
    try {
      setIsPurchasing(true);
      const customerInfo = await makePurchase(packageToPurchase);

      // 購入後に顧客情報を更新
      await refreshCustomerInfo();

      return customerInfo;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    } finally {
      setIsPurchasing(false);
    }
  }, [refreshCustomerInfo]);

  // 購入復元処理
  const restoreUserPurchases = useCallback(async () => {
    try {
      setIsRestoring(true);
      const customerInfo = await restorePurchases();

      // 復元後に顧客情報を更新
      await refreshCustomerInfo();

      return customerInfo;
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    } finally {
      setIsRestoring(false);
    }
  }, [refreshCustomerInfo]);

  // 特定のエンタイトルメントの確認
  const checkEntitlement = useCallback((entitlementId: string) => {
    return isEntitled(entitlementId);
  }, [isEntitled]);

  // サブスクリプション情報の取得
  const getSubscriptionDetails = useCallback((entitlementId: string) => {
    return getSubscriptionInfo(entitlementId);
  }, [getSubscriptionInfo]);

  // 利用可能なオファリングの取得
  const getAvailableOfferings = useCallback(() => {
    return offerings;
  }, [offerings]);

  // 特定のオファリングの取得
  const getOfferingById = useCallback((offeringId: string) => {
    return offerings.find(offering => offering.identifier === offeringId);
  }, [offerings]);

  return {
    // 状態
    customerInfo,
    offerings,
    isLoading: revenueCatLoading,
    error: revenueCatError,
    isPurchasing,
    isRestoring,

    // アクション
    purchasePackage,
    restoreUserPurchases,
    refreshCustomerInfo,
    refreshOfferings,

    // ユーティリティ
    checkEntitlement,
    getSubscriptionDetails,
    getAvailableOfferings,
    getOfferingById,
  };
};

// サブスクリプション管理専用のフック
export const useSubscription = (entitlementId: string) => {
  const {
    customerInfo,
    checkEntitlement,
    getSubscriptionDetails,
    purchasePackage,
    restoreUserPurchases,
    isPurchasing,
    isRestoring
  } = useRevenueCat();

  const isSubscribed = checkEntitlement(entitlementId);
  const subscriptionInfo = getSubscriptionDetails(entitlementId);

  return {
    isSubscribed,
    subscriptionInfo,
    customerInfo,
    purchasePackage,
    restoreUserPurchases,
    isPurchasing,
    isRestoring,
  };
};
