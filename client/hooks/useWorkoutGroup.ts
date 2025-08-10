import { useQuery, useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import {
  WorkoutGroupsDocument,
  CurrentUserWorkoutGroupsDocument,
  WorkoutGroupDocument,
  CreateWorkoutGroupDocument
} from '../documents'
import {
  WorkoutGroupsQuery,
  CurrentUserWorkoutGroupsQuery,
  WorkoutGroupQuery,
  CreateWorkoutGroupMutation,
  CreateWorkoutGroupMutationVariables
} from '../types/graphql';

export interface Member {
  id: string;
  workoutId: string;
  date: string;
  createdAt: string;
  userName: string;
}

export function useWorkoutGroups() {
  const {
    data: workoutGroupsData,
    loading: workoutGroupsLoading,
    error: workoutGroupsError,
    refetch: refetchWorkoutGroups
  } = useQuery<WorkoutGroupsQuery>(WorkoutGroupsDocument);

  return {
    workoutGroups: workoutGroupsData?.workoutGroups || [],
    loading: workoutGroupsLoading,
    error: workoutGroupsError,
    refetch: refetchWorkoutGroups,
  };
}

export function useCurrentUserWorkoutGroups() {
  const {
    data: currentUserWorkoutGroupsData,
    loading: currentUserWorkoutGroupsLoading,
    error: currentUserWorkoutGroupsError,
    refetch: refetchCurrentUserWorkoutGroups
  } = useQuery<CurrentUserWorkoutGroupsQuery>(CurrentUserWorkoutGroupsDocument);

  // 参加中のグループを取得
  const joinedGroups = currentUserWorkoutGroupsData?.currentUser.workouts
    .filter(workout => workout.workoutGroup)
    .map(workout => workout.workoutGroup)
    .filter((group, index, self) =>
      group && self.findIndex(g => g?.id === group.id) === index
    ) || [];

  return {
    joinedGroups,
    currentUserWorkouts: currentUserWorkoutGroupsData?.currentUser.workouts || [],
    loading: currentUserWorkoutGroupsLoading,
    error: currentUserWorkoutGroupsError,
    refetch: refetchCurrentUserWorkoutGroups,
  };
}

export function useWorkoutGroup(id: string) {
  const {
    data: workoutGroupData,
    loading: workoutGroupLoading,
    error: workoutGroupError,
    refetch: refetchWorkoutGroup
  } = useQuery<WorkoutGroupQuery>(WorkoutGroupDocument, {
    variables: { id },
    skip: !id,
  });

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY年MM月DD日');
  };

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format('YYYY年MM月DD日 HH:mm');
  };

  // メンバー情報を取得
  const members: Member[] = workoutGroupData?.workoutGroup?.workouts
    .map(workout => ({
      id: workout?.id || '',
      workoutId: workout?.id || '',
      date: workout?.date || '',
      createdAt: workout?.createdAt || '',
      userName: workout?.user?.profile?.name || '名前未設定'
    })) || [];

  return {
    workoutGroup: workoutGroupData?.workoutGroup,
    members,
    formatDate,
    formatDateTime,
    loading: workoutGroupLoading,
    error: workoutGroupError,
    refetch: refetchWorkoutGroup,
  };
}

// グループ名のみを取得するためのヘルパー関数
export function useWorkoutGroupTitle(id: string) {
  const { workoutGroup, loading, error } = useWorkoutGroup(id);

  return {
    groupTitle: workoutGroup?.title,
    loading,
    error,
  };
}

export function useCreateWorkoutGroup() {
  const [createWorkoutGroup, { loading: createGroupLoading }] = useMutation<
    CreateWorkoutGroupMutation,
    CreateWorkoutGroupMutationVariables
  >(CreateWorkoutGroupDocument);

  const createGroup = async (input: { title: string; date?: string }) => {
    try {
      const result = await createWorkoutGroup({
        variables: {
          input: {
            title: input.title,
            date: input.date,
          },
        },
      });
      return { success: true, data: result.data?.createWorkoutGroup };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    createGroup,
    loading: createGroupLoading,
  };
}

// 参加可能なグループを取得するヘルパー関数
export function useAvailableWorkoutGroups() {
  const { workoutGroups, loading: workoutGroupsLoading, error: workoutGroupsError, refetch: refetchWorkoutGroups } = useWorkoutGroups();
  const { joinedGroups, loading: currentUserLoading, error: currentUserError, refetch: refetchCurrentUser } = useCurrentUserWorkoutGroups();

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY年MM月DD日');
  };

  // 参加可能なグループを取得（参加中のグループを除く）
  const availableGroups = workoutGroups.filter(group =>
    !joinedGroups.some(joinedGroup => joinedGroup?.id === group.id)
  );

  const refetchAll = async () => {
    await Promise.all([
      refetchWorkoutGroups(),
      refetchCurrentUser()
    ]);
  };

  return {
    availableGroups,
    joinedGroups,
    formatDate,
    loading: workoutGroupsLoading || currentUserLoading,
    error: workoutGroupsError || currentUserError,
    refetch: refetchAll,
  };
}
