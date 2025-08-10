import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

type TabType = 'friends' | 'requests';

interface FriendsTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  friendsCount: number;
  requestsCount: number;
}

export function FriendsTabBar({
  activeTab,
  onTabChange,
  friendsCount,
  requestsCount
}: FriendsTabBarProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'friends' ? styles.tabButtonActive : styles.tabButtonInactive
        ]}
        onPress={() => onTabChange('friends')}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'friends' ? styles.tabTextActive : styles.tabTextInactive
        ]}>
          フレンド
        </Text>
        {friendsCount > 0 && (
          <View style={styles.requestsBadge}>
            <Text style={styles.requestsBadgeText}>{friendsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'requests' ? styles.tabButtonActive : styles.tabButtonInactive
        ]}
        onPress={() => onTabChange('requests')}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'requests' ? styles.tabTextActive : styles.tabTextInactive
        ]}>
          リクエスト
        </Text>
        {requestsCount > 0 && (
          <View style={styles.requestsBadge}>
            <Text style={styles.requestsBadgeText}>{requestsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    borderRadius: 12,
    marginBottom: 20,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  tabButtonActive: {
    backgroundColor: theme.primary,
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabTextInactive: {
    color: theme.textSecondary,
  },
  requestsBadge: {
    backgroundColor: theme.error,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  requestsBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
