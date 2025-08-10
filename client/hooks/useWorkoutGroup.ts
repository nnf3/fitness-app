import { useQuery, useMutation } from '@apollo/client';
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

  return {
    workoutGroup: workoutGroupData?.workoutGroup,
    loading: workoutGroupLoading,
    error: workoutGroupError,
    refetch: refetchWorkoutGroup,
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
    loading: workoutGroupsLoading || currentUserLoading,
    error: workoutGroupsError || currentUserError,
    refetch: refetchAll,
  };
}
