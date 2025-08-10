import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface SwipeableGroupCardProps {
  group: {
    id: string;
    title: string;
    date?: string;
    imageURL?: string;
  };
  onPress: () => void;
  formatDate: (date: string) => string;
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  groupImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  groupImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: theme.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupCardHeader: {
    flex: 1,
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  groupDate: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
  },
});

export function SwipeableGroupCard({ group, onPress, formatDate }: SwipeableGroupCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={styles.cardContent}>
          {group.imageURL ? (
            <Image source={{ uri: group.imageURL }} style={styles.groupImage} />
          ) : (
            <View style={styles.groupImagePlaceholder}>
              <FontAwesome name="users" size={24} color={theme.textSecondary} />
            </View>
          )}
          <View style={styles.groupCardHeader}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <Text style={styles.groupDate}>
              {group.date ? formatDate(group.date) : '日付未設定'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
