import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQuery, useMutation } from '@apollo/client';
import { GetFriends, GetFriendshipRequests } from '../../documents/queries';
import { AcceptFriendshipRequestDocument, RejectFriendshipRequestDocument } from '../../documents/mutations';
import { GetFriendsQuery, GetFriendsQueryVariables } from '../../types/graphql';

type TabType = 'friends' | 'requests';

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
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
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: 12,
    marginBottom: 8,
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

export function FriendsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [activeTab, setActiveTab] = useState<TabType>('friends');

  // GraphQLクエリでフレンドデータを取得
  const { data: friendsData, loading: friendsLoading, error: friendsError } = useQuery<GetFriendsQuery, GetFriendsQueryVariables>(GetFriends);
  const { data: requestsData, loading: requestsLoading, error: requestsError } = useQuery(GetFriendshipRequests);

  // GraphQLミューテーション
  const [acceptRequest, { loading: acceptLoading }] = useMutation(AcceptFriendshipRequestDocument, {
    refetchQueries: [
      { query: GetFriends },
      { query: GetFriendshipRequests }
    ],
    onCompleted: () => {
      Alert.alert('成功', 'フレンドリクエストを承認しました');
    },
    onError: (error) => {
      Alert.alert('エラー', `リクエストの承認に失敗しました: ${error.message}`);
    }
  });

  const [rejectRequest, { loading: rejectLoading }] = useMutation(RejectFriendshipRequestDocument, {
    refetchQueries: [
      { query: GetFriends },
      { query: GetFriendshipRequests }
    ],
    onCompleted: () => {
      Alert.alert('成功', 'フレンドリクエストを拒否しました');
    },
    onError: (error) => {
      Alert.alert('エラー', `リクエストの拒否に失敗しました: ${error.message}`);
    }
  });

  // フレンドデータの処理
  const friends = friendsData?.currentUser?.friends || [];
  const pendingRequests = requestsData?.currentUser?.friendshipRequests?.filter(
    (friendship: any) => friendship.status === 'PENDING'
  ) || [];



  const handleFriendPress = (friend: any) => {
    Alert.alert('フレンド詳細', `${friend.profile?.name || 'Unknown'}の詳細画面を開きます`);
  };

  const handleAcceptRequest = (requestId: string) => {
    Alert.alert(
      'フレンドリクエスト承認',
      'このリクエストを承認しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '承認',
          onPress: () => {
            acceptRequest({
              variables: {
                input: {
                  friendshipID: requestId
                }
              }
            });
          },
        },
      ]
    );
  };

  const handleRejectRequest = (requestId: string) => {
    Alert.alert(
      'フレンドリクエスト拒否',
      'このリクエストを拒否しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '拒否',
          style: 'destructive',
          onPress: () => {
            rejectRequest({
              variables: {
                input: {
                  friendshipID: requestId
                }
              }
            });
          },
        },
      ]
    );
  };

  const renderFriendsTab = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>フレンド一覧</Text>

      {friendsLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.emptyStateText}>フレンドを読み込み中...</Text>
        </View>
      ) : friendsError ? (
        <View style={styles.emptyState}>
          <FontAwesome name="exclamation-triangle" size={48} color={theme.error} />
          <Text style={styles.emptyStateText}>
            エラーが発生しました{'\n'}
            {friendsError.message}
          </Text>
        </View>
      ) : friends.length > 0 ? (
        friends.map((friend: any) => (
          <TouchableOpacity
            key={friend.id}
            style={styles.friendItem}
            onPress={() => handleFriendPress(friend)}
          >
            <View style={styles.friendAvatar}>
              <Text style={styles.friendAvatarText}>
                {friend.profile?.name?.charAt(0) || '?'}
              </Text>
            </View>
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.profile?.name || 'Unknown'}</Text>
              <Text style={styles.friendStatus}>
                フレンド登録日: {new Date(friend.createdAt).toLocaleDateString('ja-JP')}
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
  );

  const renderRequestsTab = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>フレンドリクエスト</Text>

      {requestsLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.emptyStateText}>リクエストを読み込み中...</Text>
        </View>
      ) : requestsError ? (
        <View style={styles.emptyState}>
          <FontAwesome name="exclamation-triangle" size={48} color={theme.error} />
          <Text style={styles.emptyStateText}>
            エラーが発生しました{'\n'}
            {requestsError.message}
          </Text>
        </View>
      ) : pendingRequests.length > 0 ? (
        pendingRequests.map((request: any) => (
          <View key={request.id} style={styles.requestItem}>
            <View style={styles.friendAvatar}>
              <Text style={styles.friendAvatarText}>
                {request.requester.profile?.name?.charAt(0) || '?'}
              </Text>
            </View>
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{request.requester.profile?.name || 'Unknown'}</Text>
              <Text style={styles.friendStatus}>
                フレンドリクエストを送信しました
              </Text>
            </View>
            <View style={styles.requestActions}>
              <TouchableOpacity
                style={[styles.acceptButton, acceptLoading && { opacity: 0.6 }]}
                onPress={() => handleAcceptRequest(request.id)}
                disabled={acceptLoading || rejectLoading}
              >
                <Text style={styles.actionButtonText}>
                  {acceptLoading ? '承認中...' : '承認'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rejectButton, rejectLoading && { opacity: 0.6 }]}
                onPress={() => handleRejectRequest(request.id)}
                disabled={acceptLoading || rejectLoading}
              >
                <Text style={styles.actionButtonText}>
                  {rejectLoading ? '拒否中...' : '拒否'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <FontAwesome name="user-plus" size={48} color={theme.textTertiary} />
          <Text style={styles.emptyStateText}>
            保留中のフレンドリクエストはありません
          </Text>
        </View>
      )}
    </View>
  );

      return (
      <View style={styles.container}>

      {/* タブ切り替え */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'friends' ? styles.tabButtonActive : styles.tabButtonInactive
          ]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'friends' ? styles.tabTextActive : styles.tabTextInactive
          ]}>
            フレンド ({friends.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'requests' ? styles.tabButtonActive : styles.tabButtonInactive
          ]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'requests' ? styles.tabTextActive : styles.tabTextInactive
          ]}>
            リクエスト ({pendingRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {activeTab === 'friends' ? renderFriendsTab() : renderRequestsTab()}
      </ScrollView>
    </View>
  );
}