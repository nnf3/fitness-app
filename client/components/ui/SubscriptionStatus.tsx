import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSubscription } from '../../hooks/useRevenueCat';
import { useTheme } from '../../theme';

interface SubscriptionStatusProps {
  entitlementId: string;
  showDetails?: boolean;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  entitlementId,
  showDetails = true
}) => {
  const { theme } = useTheme();
  const {
    isSubscribed,
    subscriptionInfo,
    customerInfo,
    isPurchasing,
    isRestoring
  } = useSubscription(entitlementId);

  const styles = createStyles(theme);

  if (isPurchasing || isRestoring) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.secondary} />
        <Text style={styles.loadingText}>
          {isPurchasing ? '購入処理中...' : '復元処理中...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: isSubscribed ? theme.success : theme.error }
        ]} />
        <Text style={styles.statusText}>
          {isSubscribed ? 'アクティブ' : '非アクティブ'}
        </Text>
      </View>

      {showDetails && isSubscribed && subscriptionInfo && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            期間: {subscriptionInfo.periodType || '不明'}
          </Text>
          {subscriptionInfo.expirationDate && (
            <Text style={styles.detailText}>
              有効期限: {new Date(subscriptionInfo.expirationDate).toLocaleDateString('ja-JP')}
            </Text>
          )}
          <Text style={styles.detailText}>
            自動更新: {subscriptionInfo.willRenew ? '有効' : '無効'}
          </Text>
        </View>
      )}

      {customerInfo && (
        <Text style={styles.customerIdText}>
          顧客ID: {customerInfo.originalAppUserId}
        </Text>
      )}
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  detailsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.divider,
  },
  detailText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  customerIdText: {
    fontSize: 12,
    color: theme.textTertiary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.textSecondary,
  },
});