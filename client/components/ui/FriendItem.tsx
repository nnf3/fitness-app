import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface FriendItemProps {
  friend: {
    id: string;
    profile?: {
      name?: string;
      imageURL?: string | null;
    } | null;
    createdAt?: string;
  };
  onPress: (friend: any) => void;
}

export function FriendItem({ friend, onPress }: FriendItemProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const friendName = friend.profile?.name || 'Unknown';
  const initial = friendName.charAt(0);
  const createdAt = friend.createdAt ? new Date(friend.createdAt).toLocaleDateString('ja-JP') : '不明';

  return (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => onPress(friend)}
    >
      <View style={styles.friendAvatar}>
        <Text style={styles.friendAvatarText}>{initial}</Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{friendName}</Text>
        <Text style={styles.friendStatus}>
          フレンド登録日: {createdAt}
        </Text>
      </View>
      <View style={styles.friendActions}>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="comment" size={16} color={theme.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="ellipsis-h" size={16} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: 12,
    marginBottom: 8,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primaryVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  friendAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  friendStatus: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  friendActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
});
