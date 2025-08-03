import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Alert } from 'react-native';
import {
  WorkoutLogsDocument,
  StartWorkoutDocument,
  WorkoutTypesDocument,
  AddSetLogDocument
} from '@/documents';
import {
  WorkoutLogsQuery,
  StartWorkoutMutation,
  WorkoutTypesQuery,
  AddSetLogMutation
} from '@/types/graphql';

interface ExpandedWorkout {
  id: string;
  isExpanded: boolean;
  selectedWorkoutType: string;
  weight: string;
  repCount: string;
}

export const useWorkout = (user: any) => {
  const [expandedWorkouts, setExpandedWorkouts] = useState<ExpandedWorkout[]>([]);

  const { data, loading, error } = useQuery<WorkoutLogsQuery>(WorkoutLogsDocument, {
    skip: !user,
  });

  const { data: workoutTypesData } = useQuery<WorkoutTypesQuery>(WorkoutTypesDocument);

  // 既存の筋トレログをexpandedWorkoutsに初期化
  useEffect(() => {
    if (data?.currentUser?.workoutLogs) {
      setExpandedWorkouts(prev => {
        // 既存のexpandedWorkoutsのIDを取得
        const existingIds = new Set(prev.map(w => w.id));

        // 新しいworkoutLogsのみをフィルタリング
        const newWorkouts = data.currentUser.workoutLogs
          .filter(workoutLog => !existingIds.has(workoutLog.id))
          .map(workoutLog => ({
            id: workoutLog.id,
            isExpanded: false,
            selectedWorkoutType: '',
            weight: '',
            repCount: '',
          }));

        // 新しいworkoutLogsがある場合のみ更新
        return newWorkouts.length > 0 ? [...prev, ...newWorkouts] : prev;
      });
    }
  }, [data?.currentUser?.workoutLogs]);

  const [startWorkout, { loading: startingWorkout }] = useMutation<StartWorkoutMutation>(StartWorkoutDocument, {
    refetchQueries: [
      { query: WorkoutLogsDocument },
    ],
    onCompleted: (data) => {
      if (data?.startWorkout) {
        // 新しいワークアウトを展開状態で追加
        const newWorkout: ExpandedWorkout = {
          id: data.startWorkout.id,
          isExpanded: true,
          selectedWorkoutType: '',
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

  const [addSetLog, { loading: addingSetLog }] = useMutation<AddSetLogMutation>(AddSetLogDocument, {
    refetchQueries: [
      { query: WorkoutLogsDocument },
    ],
    onCompleted: (data) => {
      if (data?.addSetLog) {
        // フォームをクリア
        setExpandedWorkouts(prev =>
          prev.map(w => ({
            ...w,
            selectedWorkoutType: '',
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

    if (!workout.selectedWorkoutType || !workout.weight || !workout.repCount) {
      Alert.alert('エラー', 'すべての項目を入力してください。');
      return;
    }

    const workoutType = workoutTypesData?.workoutTypes.find(wt => wt.id === workout.selectedWorkoutType);
    if (!workoutType) {
      Alert.alert('エラー', '選択された筋トレ種目が見つかりません。');
      return;
    }

    try {
      await addSetLog({
        variables: {
          input: {
            workoutLogID: workoutId,
            workoutTypeID: workout.selectedWorkoutType,
            weight: parseFloat(workout.weight),
            repCount: parseInt(workout.repCount),
          },
        },
      });
    } catch (error) {
      Alert.alert('エラー', `セット記録の追加に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [expandedWorkouts, workoutTypesData, addSetLog]);

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
      selectedWorkoutType: '',
      weight: '',
      repCount: '',
    };
  }, [expandedWorkouts]);

  return {
    data,
    loading,
    error,
    workoutTypesData,
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