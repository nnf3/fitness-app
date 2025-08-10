import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQuery } from '@apollo/client';
import { CurrentUserDocument } from '../../documents/queries';
import { CurrentUserQuery } from '../../types/graphql';
import {
  FriendItem,
  FriendQRModal,
  FriendsTabBar,
  FriendshipRequestItem,
  EmptyState,
} from '../ui';
import { useFriends, useFriendRequest, useFriendshipActions } from '../../hooks';

type TabType = 'friends' | 'requests';

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addFriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addFriendButtonText: {
    color: theme.background,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export function FriendsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [refreshing, setRefreshing] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const { addFriendByQR } = useFriendRequest();

  // カスタムフックを使用してフレンド、リクエスト、アクションを取得
  const {
    friends,
    pendingRequests,
    friendsLoading,
    requestsLoading,
    acceptLoading,
    rejectLoading,
    friendsError,
    requestsError,
    acceptRequest,
    rejectRequest,
    refreshData
  } = useFriends();

  const { handleAcceptRequest, handleRejectRequest } = useFriendshipActions();
  const { data: userData } = useQuery<CurrentUserQuery>(CurrentUserDocument);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch {
      // エラーは静かに処理
    } finally {
      setRefreshing(false);
    }
  };

  const handleFriendPress = (friend: any) => {
    Alert.alert('フレンド詳細', `${friend.profile?.name || 'Unknown'}の詳細画面を開きます`);
  };

  const handleAcceptRequestPress = (requestId: string) => {
    handleAcceptRequest(requestId, acceptRequest);
  };

  const handleRejectRequestPress = (requestId: string) => {
    handleRejectRequest(requestId, rejectRequest);
  };

  const handleSendFriendRequest = async (targetUserId: string) => {
    try {
      await addFriendByQR(targetUserId);
    } catch (error: any) {
      // Alert表示を削除し、エラーをそのままthrow
      throw error;
    }
  };

  const renderFriendsTab = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>フレンド一覧</Text>
        <TouchableOpacity
          style={styles.addFriendButton}
          onPress={() => setShowQRModal(true)}
        >
          <FontAwesome name="qrcode" size={16} color={theme.background} />
          <Text style={styles.addFriendButtonText}>友達追加</Text>
        </TouchableOpacity>
      </View>

      {friendsLoading ? (
        <EmptyState type="loading" title="フレンドを読み込み中..." />
      ) : friendsError ? (
        <EmptyState
          type="error"
          title="エラーが発生しました"
          errorMessage={friendsError.message}
        />
      ) : friends.length > 0 ? (
        friends.map((friend: any) => (
          <FriendItem
            key={friend.id}
            friend={friend}
            onPress={handleFriendPress}
          />
        ))
      ) : (
        <EmptyState
          type="empty"
          icon="users"
          title="まだフレンドがいません"
          message="フレンドを追加して一緒にワークアウトしましょう！"
        />
      )}
    </View>
  );

  const renderRequestsTab = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>フレンドリクエスト</Text>

      {requestsLoading ? (
        <EmptyState type="loading" title="リクエストを読み込み中..." />
      ) : requestsError ? (
        <EmptyState
          type="error"
          title="エラーが発生しました"
          errorMessage={requestsError.message}
        />
      ) : pendingRequests.length > 0 ? (
        pendingRequests.map((request: any) => (
          <FriendshipRequestItem
            key={request.id}
            request={request}
            onAccept={handleAcceptRequestPress}
            onReject={handleRejectRequestPress}
            acceptLoading={acceptLoading}
            rejectLoading={rejectLoading}
          />
        ))
      ) : (
        <EmptyState
          type="empty"
          icon="user-plus"
          title="保留中のフレンドリクエストはありません"
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      >
        <FriendsTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          friendsCount={friends.length}
          requestsCount={pendingRequests.length}
        />

        {activeTab === 'friends' ? renderFriendsTab() : renderRequestsTab()}
      </ScrollView>

      <FriendQRModal
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
        userId={userData?.currentUser?.id || ''}
        userName={userData?.currentUser?.profile?.name}
        onSendFriendRequest={handleSendFriendRequest}
      />
    </View>
  );
}