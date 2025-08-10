import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface FriendshipRequestItemProps {
  request: {
    id: string;
    requester: {
      profile?: {
        name?: string;
        imageURL?: string | null;
      } | null;
    };
  };
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  acceptLoading: boolean;
  rejectLoading: boolean;
}

export function FriendshipRequestItem({
  request,
  onAccept,
  onReject,
  acceptLoading,
  rejectLoading
}: FriendshipRequestItemProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const requesterName = request.requester.profile?.name || 'Unknown';
  const initial = requesterName.charAt(0);

  return (
    <View style={styles.requestItem}>
      <View style={styles.friendAvatar}>
        <Text style={styles.friendAvatarText}>{initial}</Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{requesterName}</Text>
        <Text style={styles.friendStatus}>
          フレンドリクエストを送信しました
        </Text>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity
          style={[styles.acceptButton, acceptLoading && { opacity: 0.6 }]}
          onPress={() => onAccept(request.id)}
          disabled={acceptLoading || rejectLoading}
        >
          <Text style={styles.actionButtonText}>
            {acceptLoading ? '承認中...' : '承認'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rejectButton, rejectLoading && { opacity: 0.6 }]}
          onPress={() => onReject(request.id)}
          disabled={acceptLoading || rejectLoading}
        >
          <Text style={styles.actionButtonText}>
            {rejectLoading ? '拒否中...' : '拒否'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  requestItem: {
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
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: theme.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: theme.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
