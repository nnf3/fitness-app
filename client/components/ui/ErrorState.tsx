import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ErrorStateProps {
  title?: string;
  errorMessage?: string;
  onRetry?: () => void;
  retryText?: string;
}

export function ErrorState({
  title,
  errorMessage,
  onRetry,
  retryText = '再試行'
}: ErrorStateProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <FontAwesome name="exclamation-triangle" size={48} color={theme.error || '#ff6b6b'} />
      <Text style={styles.errorText}>
        {title || 'エラーが発生しました'}
        {errorMessage && '\n' + errorMessage}
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
        >
          <FontAwesome name="refresh" size={16} color={theme.text} />
          <Text style={styles.retryButtonText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceVariant,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: theme.text,
    fontSize: 14,
    marginLeft: 8,
  },
});
