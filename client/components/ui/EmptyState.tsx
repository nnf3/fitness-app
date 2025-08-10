import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface EmptyStateProps {
  type: 'loading' | 'error' | 'empty';
  title?: string;
  message?: string;
  icon?: string;
  errorMessage?: string;
}

export function EmptyState({
  type,
  title,
  message,
  icon,
  errorMessage
}: EmptyStateProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const renderContent = () => {
    switch (type) {
      case 'loading':
        return (
          <>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={styles.emptyStateText}>
              {title || '読み込み中...'}
            </Text>
          </>
        );

      case 'error':
        return (
          <>
            <FontAwesome name="exclamation-triangle" size={48} color={theme.error} />
            <Text style={styles.emptyStateText}>
              {title || 'エラーが発生しました'}
              {errorMessage && '\n' + errorMessage}
            </Text>
          </>
        );

      case 'empty':
        return (
          <>
            <FontAwesome name={icon as any || "inbox"} size={48} color={theme.textTertiary} />
            <Text style={styles.emptyStateText}>
              {title || 'データがありません'}
              {message && '\n' + message}
            </Text>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.emptyState}>
      {renderContent()}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});
