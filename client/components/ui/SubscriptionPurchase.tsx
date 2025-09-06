import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRevenueCat } from '../../hooks/useRevenueCat';
import { useTheme } from '../../theme';
import { PurchasesPackage } from 'react-native-purchases';

interface SubscriptionPurchaseProps {
  entitlementId: string;
  offeringId?: string;
}

export const SubscriptionPurchase: React.FC<SubscriptionPurchaseProps> = ({
  entitlementId,
  offeringId
}) => {
  const { theme } = useTheme();
  const {
    offerings,
    purchasePackage,
    restoreUserPurchases,
    isPurchasing,
    isRestoring,
    checkEntitlement
  } = useRevenueCat();

  const styles = createStyles(theme);

  // 既にサブスクリプションを持っている場合は何も表示しない
  if (checkEntitlement(entitlementId)) {
    return (
      <View style={styles.container}>
        <Text style={styles.alreadySubscribedText}>
          既にサブスクリプションに加入しています
        </Text>
      </View>
    );
  }

  // オファリングを取得
  const offering = offeringId
    ? offerings.find(o => o.identifier === offeringId)
    : offerings[0]; // 最初のオファリングを使用

  if (!offering || !offering.availablePackages.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noOfferingsText}>
          利用可能なサブスクリプションがありません
        </Text>
      </View>
    );
  }

  const handlePurchase = async (packageToPurchase: PurchasesPackage) => {
    try {
      await purchasePackage(packageToPurchase);
      Alert.alert('成功', 'サブスクリプションの購入が完了しました！');
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('エラー', '購入に失敗しました。もう一度お試しください。');
    }
  };

  const handleRestore = async () => {
    try {
      await restoreUserPurchases();
      Alert.alert('成功', '購入履歴の復元が完了しました！');
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('エラー', '復元に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>サブスクリプション</Text>

      {offering.availablePackages.map((pkg) => (
        <View key={pkg.identifier} style={styles.packageContainer}>
          <View style={styles.packageInfo}>
            <Text style={styles.packageTitle}>{pkg.product.title}</Text>
            <Text style={styles.packageDescription}>{pkg.product.description}</Text>
            <Text style={styles.packagePrice}>{pkg.product.priceString}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.purchaseButton,
              isPurchasing && styles.disabledButton
            ]}
            onPress={() => handlePurchase(pkg)}
            disabled={isPurchasing || isRestoring}
          >
            {isPurchasing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.purchaseButtonText}>購入</Text>
            )}
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={[
          styles.restoreButton,
          isRestoring && styles.disabledButton
        ]}
        onPress={handleRestore}
        disabled={isPurchasing || isRestoring}
      >
        {isRestoring ? (
          <ActivityIndicator size="small" color={theme.secondary} />
        ) : (
          <Text style={styles.restoreButtonText}>購入履歴を復元</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    marginVertical: 8,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: theme.text,
  },
  packageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: theme.background,
  },
  packageInfo: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.secondary,
  },
  purchaseButton: {
    backgroundColor: theme.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  restoreButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.secondary,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  restoreButtonText: {
    color: theme.secondary,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  alreadySubscribedText: {
    fontSize: 16,
    color: theme.success,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noOfferingsText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
  },
});