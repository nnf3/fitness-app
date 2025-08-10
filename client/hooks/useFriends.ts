import { useQuery, useMutation } from '@apollo/client';
import { Alert } from 'react-native';
import {
  GetFriendsDocument,
  AddWorkoutGroupMemberDocument,
} from '../documents';
import {
  GetFriendsQuery,
  AddWorkoutGroupMemberMutation,
  AddWorkoutGroupMemberMutationVariables,
} from '../types/graphql';

export function useFriends() {
  const {
    data: friendsData,
    loading: friendsLoading,
    error: friendsError,
    refetch: refetchFriends
  } = useQuery<GetFriendsQuery>(GetFriendsDocument);

  return {
    friends: friendsData?.currentUser?.friends || [],
    loading: friendsLoading,
    error: friendsError,
    refetch: refetchFriends,
  };
}

export function useAddWorkoutGroupMember() {
  const [addWorkoutGroupMember, { loading: addMemberLoading }] = useMutation<
    AddWorkoutGroupMemberMutation,
    AddWorkoutGroupMemberMutationVariables
  >(AddWorkoutGroupMemberDocument);

  const addMember = async (workoutGroupID: string, userID: string) => {
    try {
      const result = await addWorkoutGroupMember({
        variables: {
          input: {
            workoutGroupID,
            userID,
          },
        },
      });
      return { success: true, data: result.data?.addWorkoutGroupMember };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    addMember,
    loading: addMemberLoading,
  };
}

// フレンド選択用のヘルパー関数
export function useFriendSelection(existingMemberIds: string[] = []) {
  const { friends, loading, error } = useFriends();

  // フレンド検索・フィルタリング
  const getFilteredFriends = (searchQuery: string) => {
    return friends.filter(friend => {
      const friendName = friend.profile?.name || '名前未設定';
      const matchesSearch = friendName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const isNotMember = !existingMemberIds.includes(friend.id);
      return matchesSearch && isNotMember;
    });
  };

  // フレンド選択の確認ダイアログ
  const showFriendSelectionConfirmation = (
    friend: any,
    onConfirm: (friend: any) => void
  ) => {
    if (existingMemberIds.includes(friend.id)) {
      Alert.alert('エラー', 'このユーザーは既にグループのメンバーです。');
      return;
    }

    Alert.alert(
      'メンバー追加の確認',
      `${friend.profile?.name || '名前未設定'}をグループに追加しますか？`,
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '追加',
          onPress: () => onConfirm(friend),
        },
      ]
    );
  };

  // イニシャル取得
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return {
    friends,
    loading,
    error,
    getFilteredFriends,
    showFriendSelectionConfirmation,
    getInitials,
  };
}
