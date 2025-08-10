import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Alert } from 'react-native';
import {
  WorkoutsDocument,
  StartWorkoutDocument,
  ExercisesDocument,
  CreateWorkoutExerciseDocument,
  CreateSetLogDocument,
} from '@/documents';
import {
  WorkoutsQuery,
  StartWorkoutMutation,
  ExercisesQuery,
  CreateWorkoutExerciseMutation,
  CreateSetLogMutation,
} from '@/types/graphql';

export const useWorkout = (user: any) => {
  const { data, loading, error } = useQuery<WorkoutsQuery>(WorkoutsDocument, {
    skip: !user,
  });

  const { data: exercisesData } = useQuery<ExercisesQuery>(ExercisesDocument);

  // 特定のワークアウトを取得する関数
  const getWorkoutById = useCallback((workoutId: string) => {
    return data?.currentUser?.workouts?.find(workout => workout?.id === workoutId);
  }, [data]);

  // ワークアウトの所有者をチェックする関数
  // currentUserのworkoutsに含まれている場合は所有者
  const isWorkoutOwner = useCallback((workoutId: string) => {
    const workout = getWorkoutById(workoutId);
    return !!workout; // currentUserのworkoutsに含まれている場合は所有者
  }, [getWorkoutById]);

  const [startWorkout, { loading: startingWorkout }] = useMutation<StartWorkoutMutation>(StartWorkoutDocument, {
    refetchQueries: [
      { query: WorkoutsDocument },
    ],
    onError: (error) => {
      Alert.alert("エラー", `筋トレの開始に失敗しました: ${error.message}`);
    },
  });

  const [createWorkoutExercise] = useMutation<CreateWorkoutExerciseMutation>(CreateWorkoutExerciseDocument, {
    refetchQueries: [
      { query: WorkoutsDocument },
    ],
  });

  const [createSetLog] = useMutation<CreateSetLogMutation>(CreateSetLogDocument, {
    refetchQueries: [
      { query: WorkoutsDocument },
    ],
  });

  const handleStartWorkout = useCallback(async (
    date?: string,
    workoutGroupID?: string,
    userId?: string,
    onSuccess?: (workoutId: string) => void
  ) => {
    const input: any = {};

    if (date) {
      input.date = date;
    }

    if (workoutGroupID) {
      input.workoutGroupID = workoutGroupID;
    }

    if (userId) {
      input.userId = userId;
    }

    try {
      const result = await startWorkout({ variables: { input } });
      if (result.data?.startWorkout?.id && onSuccess) {
        onSuccess(result.data.startWorkout.id);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }, [startWorkout]);

  const handleAddSetLog = useCallback(async (
    workoutId: string,
    exerciseId: string,
    weight: number,
    repCount: number,
    setNumber: number
  ) => {
    try {
      // まず、この workout と exercise の組み合わせで WorkoutExercise を作成
      const workoutExerciseResult = await createWorkoutExercise({
        variables: {
          input: {
            workoutID: workoutId,
            exerciseID: exerciseId,
          },
        },
      });

      const workoutExerciseId = workoutExerciseResult.data?.createWorkoutExercise?.id;
      if (!workoutExerciseId) {
        throw new Error('ワークアウト種目の作成に失敗しました。');
      }

      // SetLog を作成
      await createSetLog({
        variables: {
          input: {
            workoutExerciseID: workoutExerciseId,
            setNumber,
            weight,
            repCount,
          },
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }, [createWorkoutExercise, createSetLog]);

  // 現在のワークアウトのセット記録を取得するヘルパー関数
  const getCurrentWorkoutSetLogs = useCallback((workoutId: string) => {
    const currentWorkout = data?.currentUser?.workouts?.find(w => w.id === workoutId);
    return currentWorkout?.workoutExercises?.flatMap(we =>
      we.setLogs?.map(setLog => ({ ...setLog, exercise: we.exercise })) || []
    ) || [];
  }, [data]);

  // 利用可能な種目のリストを取得するヘルパー関数
  const getAvailableExercises = useCallback((workoutId: string) => {
    const allSetLogs = getCurrentWorkoutSetLogs(workoutId);
    const existingExercises = [...new Set(allSetLogs.map(setLog => setLog.exercise.name))];
    const allExercises = exercisesData?.exercises?.map(ex => ex.name) || [];

    // 既存の種目と全ての種目を結合して重複を除去
    return [...new Set([...existingExercises, ...allExercises])];
  }, [getCurrentWorkoutSetLogs, exercisesData]);

  // 選択された種目のセット記録を取得するヘルパー関数
  const getSelectedExerciseSetLogs = useCallback((workoutId: string, exerciseName: string) => {
    const allSetLogs = getCurrentWorkoutSetLogs(workoutId);
    return allSetLogs.filter(setLog => setLog.exercise.name === exerciseName);
  }, [getCurrentWorkoutSetLogs]);

  // 次のセット番号を計算するヘルパー関数
  const getNextSetNumber = useCallback((workoutId: string, exerciseName: string) => {
    const setLogs = getSelectedExerciseSetLogs(workoutId, exerciseName);
    if (setLogs.length === 0) return 1;
    const maxSetNumber = Math.max(...setLogs.map(setLog => setLog.setNumber));
    return maxSetNumber + 1;
  }, [getSelectedExerciseSetLogs]);

  return {
    data,
    loading,
    error,
    exercisesData,
    startingWorkout,
    handleStartWorkout,
    handleAddSetLog,
    getCurrentWorkoutSetLogs,
    getAvailableExercises,
    getSelectedExerciseSetLogs,
    getNextSetNumber,
    getWorkoutById,
    isWorkoutOwner,
  };
};