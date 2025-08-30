import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useTheme } from '../../theme';
import { useAdMobContext } from '../../lib/AdMobProvider';

interface AdBannerProps {
  size?: BannerAdSize;
}

export function AdBanner({
  size = BannerAdSize.BANNER
}: AdBannerProps) {
  const { theme } = useTheme();
  const { isInitialized, isInitializing, error, config } = useAdMobContext();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surface,
      marginVertical: 10,
      borderRadius: 8,
      overflow: 'hidden',
      minHeight: 50,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surfaceVariant,
      padding: 10,
    },
    loadingText: {
      color: theme.textSecondary,
      fontSize: 12,
    },
  });

  // AdMobが初期化中の場合
  if (isInitializing) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>広告を読み込み中...</Text>
      </View>
    );
  }

  // AdMobの初期化に失敗した場合
  if (error) {
    console.warn('AdMob initialization failed:', error.message);
    return null;
  }

  // AdMobが初期化されていない場合
  if (!isInitialized) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={config.bannerUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}
