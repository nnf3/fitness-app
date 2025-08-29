import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
}

export function EmptyState({
  title,
  message,
  icon
}: EmptyStateProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.emptyState}>
      <FontAwesome name={icon as any || "inbox"} size={48} color={theme.textTertiary} />
      <Text style={styles.emptyStateText}>
        {title || 'データがありません'}
        {message && '\n' + message}
      </Text>
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
