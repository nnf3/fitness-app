import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Alert } from 'react-native';
import {
  WorkoutsDocument,
  StartWorkoutDocument,
  ExercisesDocument,
  CreateSetLogDocument,
  CreateWorkoutExerciseDocument
} from '@/documents';
import {
  WorkoutsQuery,
  StartWorkoutMutation,
  ExercisesQuery,
  CreateSetLogMutation,
  CreateWorkoutExerciseMutation
} from '@/types/graphql';

interface ExpandedWorkout {
  id: string;
  isExpanded: boolean;
  selectedExercise: string;
  weight: string;
  repCount: string;
  workoutExerciseId?: string;
}

export const useWorkout = (user: any) => {
  const [expandedWorkouts, setExpandedWorkouts] = useState<ExpandedWorkout[]>([]);

  const { data, loading, error } = useQuery<WorkoutsQuery>(WorkoutsDocument, {
    skip: !user,
  });

  const { data: exercisesData } = useQuery<ExercisesQuery>(ExercisesDocument);

  // 既存のワークアウトをexpandedWorkoutsに初期化
  useEffect(() => {
    if (data?.currentUser?.workouts) {
      setExpandedWorkouts(prev => {
        // 既存のexpandedWorkoutsのIDを取得
        const existingIds = new Set(prev.map(w => w.id));

        // 新しいworkoutsのみをフィルタリング
        const newWorkouts = data.currentUser.workouts
          .filter(workout => !existingIds.has(workout.id))
          .map(workout => ({
            id: workout.id,
            isExpanded: false,
            selectedExercise: '',
            weight: '',
            repCount: '',
          }));

        // 新しいworkoutsがある場合のみ更新
        return newWorkouts.length > 0 ? [...prev, ...newWorkouts] : prev;
      });
    }
  }, [data?.currentUser?.workouts]);

  const [startWorkout, { loading: startingWorkout }] = useMutation<StartWorkoutMutation>(StartWorkoutDocument, {
    refetchQueries: [
      { query: WorkoutsDocument },
    ],
    onCompleted: (data) => {
      if (data?.startWorkout) {
        // 新しいワークアウトを展開状態で追加
        const newWorkout: ExpandedWorkout = {
          id: data.startWorkout.id,
          isExpanded: true,
          selectedExercise: '',
          weight: '',
          repCount: '',
        };
        setExpandedWorkouts(prev => [newWorkout, ...prev]);
        Alert.alert("筋トレ開始", "新しい筋トレセッションを開始しました！");
      }
    },
    onError: (error) => {
      Alert.alert("エラー", `筋トレの開始に失敗しました: ${error.message}`);
    },
  });

  const [createWorkoutExercise] = useMutation<CreateWorkoutExerciseMutation>(CreateWorkoutExerciseDocument);
  const [createSetLog, { loading: addingSetLog }] = useMutation<CreateSetLogMutation>(CreateSetLogDocument, {
    refetchQueries: [
      { query: WorkoutsDocument },
    ],
    onCompleted: (data) => {
      if (data?.createSetLog) {
        // フォームをクリア
        setExpandedWorkouts(prev =>
          prev.map(w => ({
            ...w,
            selectedExercise: '',
            weight: '',
            repCount: '',
          }))
        );
      }
    },
    onError: (error) => {
      Alert.alert('エラー', `セット記録の追加に失敗しました: ${error.message}`);
    },
  });

  const handleStartWorkout = useCallback(() => {
    startWorkout();
  }, [startWorkout]);

  const toggleWorkoutExpansion = useCallback((workoutId: string) => {
    setExpandedWorkouts(prev =>
      prev.map(workout =>
        workout.id === workoutId
          ? { ...workout, isExpanded: !workout.isExpanded }
          : workout
      )
    );
  }, []);

  const handleAddSetLog = useCallback(async (workoutId: string) => {
    const workout = expandedWorkouts.find(w => w.id === workoutId);
    if (!workout) return;

    if (!workout.selectedExercise || !workout.weight || !workout.repCount) {
      Alert.alert('エラー', 'すべての項目を入力してください。');
      return;
    }

    const exercise = exercisesData?.exercises.find(ex => ex.id === workout.selectedExercise);
    if (!exercise) {
      Alert.alert('エラー', '選択された種目が見つかりません。');
      return;
    }

    try {
      // まず、この workout と exercise の組み合わせで WorkoutExercise を作成
      let workoutExerciseId = workout.workoutExerciseId;
      
      if (!workoutExerciseId) {
        const workoutExerciseResult = await createWorkoutExercise({
          variables: {
            input: {
              workoutID: workoutId,
              exerciseID: workout.selectedExercise,
            },
          },
        });
        
        workoutExerciseId = workoutExerciseResult.data?.createWorkoutExercise?.id;
        
        if (!workoutExerciseId) {
          Alert.alert('エラー', 'ワークアウト種目の作成に失敗しました。');
          return;
        }
        
        // workoutExerciseId を保存
        setExpandedWorkouts(prev =>
          prev.map(w =>
            w.id === workoutId
              ? { ...w, workoutExerciseId }
              : w
          )
        );
      }

      // 現在のセット数を計算（既存のセットログ数 + 1）
      const currentWorkout = data?.currentUser?.workouts?.find(w => w.id === workoutId);
      const workoutExercise = currentWorkout?.workoutExercises?.find(we => we.exercise.id === workout.selectedExercise);
      const setNumber = (workoutExercise?.setLogs?.length || 0) + 1;

      // SetLog を作成
      await createSetLog({
        variables: {
          input: {
            workoutExerciseID: workoutExerciseId,
            setNumber,
            weight: parseFloat(workout.weight),
            repCount: parseInt(workout.repCount),
          },
        },
      });
    } catch (error) {
      Alert.alert('エラー', `セット記録の追加に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [expandedWorkouts, exercisesData, createWorkoutExercise, createSetLog, data]);

  const updateWorkoutForm = useCallback((workoutId: string, field: keyof ExpandedWorkout, value: string) => {
    setExpandedWorkouts(prev =>
      prev.map(w =>
        w.id === workoutId
          ? { ...w, [field]: value }
          : w
      )
    );
  }, []);

  const getExpandedWorkout = useCallback((workoutId: string): ExpandedWorkout => {
    return expandedWorkouts.find(w => w.id === workoutId) || {
      id: workoutId,
      isExpanded: false,
      selectedExercise: '',
      weight: '',
      repCount: '',
    };
  }, [expandedWorkouts]);

  return {
    data,
    loading,
    error,
    exercisesData,
    expandedWorkouts,
    startingWorkout,
    addingSetLog,
    handleStartWorkout,
    toggleWorkoutExpansion,
    handleAddSetLog,
    updateWorkoutForm,
    getExpandedWorkout,
  };
};