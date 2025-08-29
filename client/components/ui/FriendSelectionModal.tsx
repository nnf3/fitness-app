import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { useTheme } from '../../theme';
import { LoadingState, ErrorState, EmptyState } from './index';
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
    overflow: 'hidden',
  },
  friendAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
              <LoadingState title="フレンドを読み込み中..." />
            )}

            {error && (
              <ErrorState 
                title="フレンドの読み込みに失敗しました"
                errorMessage={error.message}
              />
            )}

            {!loading && !error && filteredFriends.length === 0 && (
              <EmptyState
                title={searchQuery ? '検索結果がありません' : 'フレンドがいません'}
                icon={searchQuery ? 'search' : 'users'}
              />
            )}

            {filteredFriends.map((friend) => (
              <TouchableOpacity
                key={friend.id}
                style={styles.friendItem}
                onPress={() => handleSelectFriend(friend)}
              >
                <View style={styles.friendAvatar}>
                  {friend.profile?.imageURL ? (
                    <Image
                      source={{ uri: friend.profile.imageURL }}
                      style={styles.friendAvatarImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.friendAvatarText}>
                      {getInitials(friend.profile?.name || '名前未設定')}
                    </Text>
                  )}
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
