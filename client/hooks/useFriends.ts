import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { Alert } from 'react-native';
import { GetFriendsDocument, GetFriendshipRequestsDocument } from '../documents/queries';
import { AcceptFriendshipRequestDocument, RejectFriendshipRequestDocument } from '../documents/mutations';
import {
  GetFriendsQuery,
  GetFriendsQueryVariables,
  GetFriendshipRequestsQuery,
  GetFriendshipRequestsQueryVariables
} from '../types/graphql';

export function useFriends() {
  // フレンド一覧の取得
  const {
    data: friendsData,
    loading: friendsLoading,
    error: friendsError,
    refetch: refetchFriends
  } = useQuery<GetFriendsQuery, GetFriendsQueryVariables>(GetFriendsDocument);

  // フレンドリクエストの取得
  const {
    data: requestsData,
    loading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests
  } = useQuery<GetFriendshipRequestsQuery, GetFriendshipRequestsQueryVariables>(GetFriendshipRequestsDocument);

  // フレンドリクエスト承認
  const [acceptRequest, { loading: acceptLoading }] = useMutation(AcceptFriendshipRequestDocument, {
    refetchQueries: [
      { query: GetFriendsDocument },
      { query: GetFriendshipRequestsDocument }
    ],
  });

  // フレンドリクエスト拒否
  const [rejectRequest, { loading: rejectLoading }] = useMutation(RejectFriendshipRequestDocument, {
    refetchQueries: [
      { query: GetFriendsDocument },
      { query: GetFriendshipRequestsDocument }
    ],
  });

  // データの加工
  const friends = friendsData?.currentUser?.friends || [];
  const pendingRequests = requestsData?.currentUser?.friendshipRequests?.filter(
    (friendship: any) => friendship.status === 'PENDING'
  ) || [];

  // リフレッシュ処理
  const refreshData = async () => {
    try {
      await Promise.all([
        refetchFriends(),
        refetchRequests()
      ]);
    } catch (error) {
      console.error('データの更新に失敗しました:', error);
    }
  };

  return {
    // データ
    friends,
    pendingRequests,

    // ローディング状態
    friendsLoading,
    requestsLoading,
    acceptLoading,
    rejectLoading,

    // エラー状態
    friendsError,
    requestsError,

    // アクション
    acceptRequest,
    rejectRequest,
    refreshData,
  };
}

export function useFriendSelection(existingMemberIds: string[] = []) {
  const { friends, friendsLoading, friendsError } = useFriends();
  const [searchQuery, setSearchQuery] = useState('');

  // 既存メンバーを除外したフレンドリスト
  const availableFriends = friends.filter((friend: any) => 
    !existingMemberIds.includes(friend.id)
  );

  // 検索フィルタリング
  const getFilteredFriends = (query: string) => {
    if (!query.trim()) {
      return availableFriends;
    }
    return availableFriends.filter((friend: any) =>
      friend.profile?.name?.toLowerCase().includes(query.toLowerCase())
    );
  };

  // イニシャル取得
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // フレンド選択確認
  const showFriendSelectionConfirmation = (friend: any, onConfirm: (friend: any) => void) => {
    Alert.alert(
      'フレンドを追加',
      `${friend.profile?.name || '名前未設定'}をグループに追加しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '追加', onPress: () => onConfirm(friend) }
      ]
    );
  };

  return {
    loading: friendsLoading,
    error: friendsError,
    getFilteredFriends,
    showFriendSelectionConfirmation,
    getInitials,
  };
}
