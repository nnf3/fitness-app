import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useTheme } from '../../theme';
import { useFriendSelection } from '../../hooks/useFriends';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface FriendSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectFriend: (friend: any) => void;
  groupId: string;
  existingMemberIds?: string[];
}

const createStyles = (theme: any) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    minHeight: 400,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  searchInput: {
    backgroundColor: theme.surfaceVariant,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.text,
  },
  friendsList: {
    flex: 1,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  friendAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  friendStatus: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  disabledFriendItem: {
    opacity: 0.5,
  },
  disabledText: {
    color: theme.textSecondary,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.textSecondary,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.error,
    padding: 20,
  },
});

export function FriendSelectionModal({
  visible,
  onClose,
  onSelectFriend,
  groupId,
  existingMemberIds = [],
}: FriendSelectionModalProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    loading,
    error,
    getFilteredFriends,
    showFriendSelectionConfirmation,
    getInitials,
  } = useFriendSelection(existingMemberIds);

  // 検索フィルタリング
  const filteredFriends = getFilteredFriends(searchQuery);

  const handleSelectFriend = (friend: any) => {
    showFriendSelectionConfirmation(friend, (selectedFriend) => {
      onSelectFriend(selectedFriend);
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* ヘッダー */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>フレンドを選択</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* 検索バー */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="フレンドを検索..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* フレンドリスト */}
          <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={true}>
            {loading && (
              <Text style={styles.loadingText}>フレンドを読み込み中...</Text>
            )}

            {error && (
              <Text style={styles.errorText}>
                フレンドの読み込みに失敗しました。
              </Text>
            )}

            {!loading && !error && filteredFriends.length === 0 && (
              <View style={styles.emptyState}>
                <FontAwesome name="users" size={48} color={theme.textSecondary} />
                <Text style={styles.emptyStateText}>
                  {searchQuery ? '検索結果がありません' : 'フレンドがいません'}
                </Text>
              </View>
            )}

            {filteredFriends.map((friend) => (
              <TouchableOpacity
                key={friend.id}
                style={styles.friendItem}
                onPress={() => handleSelectFriend(friend)}
              >
                <View style={styles.friendAvatar}>
                  <Text style={styles.friendAvatarText}>
                    {getInitials(friend.profile?.name || '名前未設定')}
                  </Text>
                </View>
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>
                    {friend.profile?.name || '名前未設定'}
                  </Text>
                  <Text style={styles.friendStatus}>
                    フレンド
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
