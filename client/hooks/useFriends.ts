import { useQuery, useMutation } from '@apollo/client';
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
