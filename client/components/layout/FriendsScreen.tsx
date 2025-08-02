import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },
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

export function FriendsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState([
    {
      id: '1',
      name: '田中太郎',
      status: 'オンライン',
      lastWorkout: '2時間前',
      avatar: '田',
    },
    {
      id: '2',
      name: '佐藤花子',
      status: 'オフライン',
      lastWorkout: '1日前',
      avatar: '佐',
    },
  ]);
  const [pendingRequests, setPendingRequests] = useState(3);

  const handleAddFriend = () => {
    Alert.alert('フレンド追加', 'フレンド検索画面に移動しますか？');
  };

  const handleFriendPress = (friend: any) => {
    Alert.alert('フレンド詳細', `${friend.name}の詳細画面を開きます`);
  };

  const handleRequestsPress = () => {
    Alert.alert('リクエスト管理', 'フレンドリクエスト管理画面を開きます');
  };

  return (
    <View style={styles.container}>
      {/* 検索・追加ヘッダー */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color={theme.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="フレンドを検索..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
            <Text style={styles.addButtonText}>追加</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* フレンド一覧 */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.sectionTitle}>フレンド一覧</Text>
            <TouchableOpacity onPress={handleRequestsPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: theme.textSecondary, fontSize: 14 }}>リクエスト</Text>
              {pendingRequests > 0 && (
                <View style={styles.requestsBadge}>
                  <Text style={styles.requestsBadgeText}>{pendingRequests}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {friends.length > 0 ? (
            friends.map((friend) => (
              <TouchableOpacity
                key={friend.id}
                style={styles.friendItem}
                onPress={() => handleFriendPress(friend)}
              >
                <View style={styles.friendAvatar}>
                  <Text style={styles.friendAvatarText}>{friend.avatar}</Text>
                </View>
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendStatus}>
                    最後のワークアウト: {friend.lastWorkout}
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
            ))
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome name="users" size={48} color={theme.textTertiary} />
              <Text style={styles.emptyStateText}>
                まだフレンドがいません{'\n'}
                フレンドを追加して一緒にワークアウトしましょう！
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}