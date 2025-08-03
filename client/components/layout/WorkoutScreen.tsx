import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { useAuth } from "../../hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { WorkoutLogsDocument, StartWorkoutDocument, WorkoutTypesDocument, AddSetLogDocument } from "@/documents";
import { WorkoutLogsQuery, StartWorkoutMutation, WorkoutTypesQuery, AddSetLogMutation } from "@/types/graphql";
import { useTheme } from "../../theme";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FormField } from "@/components/forms";

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: theme.text,
  },
  section: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  addWorkoutButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addWorkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  workoutCard: {
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  workoutCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  toggleButton: {
    padding: 4,
  },
  setLogItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 4,
  },
  setLogText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.textSecondary,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.error,
    marginBottom: 20,
  },
  // フォーム用のスタイル

  formTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },

  addButton: {
    backgroundColor: theme.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  setLogItemForm: {
    backgroundColor: theme.surfaceVariant,
    padding: 8,
    borderRadius: 4,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setLogTextForm: {
    fontSize: 12,
    color: theme.text,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: theme.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: theme.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  halfWidth: {
    flex: 1,
  },
});

interface ExpandedWorkout {
  id: string;
  isExpanded: boolean;
  selectedWorkoutType: string;
  weight: string;
  repCount: string;
}

export function WorkoutScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [expandedWorkouts, setExpandedWorkouts] = useState<ExpandedWorkout[]>([]);

  const { data, loading, error } = useQuery<WorkoutLogsQuery>(WorkoutLogsDocument, {
    skip: !user,
  });

  // workoutLogsのIDリストをメモ化
  const workoutLogIds = useMemo(() => {
    return data?.currentUser?.workoutLogs?.map(log => log.id) || [];
  }, [data?.currentUser?.workoutLogs]);

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

  const { data: workoutTypesData, loading: loadingWorkoutTypes } = useQuery<WorkoutTypesQuery>(WorkoutTypesDocument);

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

  const styles = createStyles(theme);

  // ログアウト時にログイン画面に遷移
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const handleStartWorkout = () => {
    startWorkout();
  };

  const toggleWorkoutExpansion = useCallback((workoutId: string) => {
    setExpandedWorkouts(prev =>
      prev.map(workout =>
        workout.id === workoutId
          ? { ...workout, isExpanded: !workout.isExpanded }
          : workout
      )
    );
  }, []);

  const handleAddSetLog = async (workoutId: string) => {
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
  };

  const updateWorkoutForm = useCallback((workoutId: string, field: keyof ExpandedWorkout, value: string) => {
    setExpandedWorkouts(prev =>
      prev.map(w =>
        w.id === workoutId
          ? { ...w, [field]: value }
          : w
      )
    );
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >

      {/* 筋トレ履歴セクション */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>筋トレ履歴</Text>
          <TouchableOpacity
            style={styles.addWorkoutButton}
            onPress={handleStartWorkout}
            disabled={startingWorkout}
          >
            <FontAwesome name="plus" size={12} color="#FFFFFF" />
            <Text style={styles.addWorkoutButtonText}>
              {startingWorkout ? "開始中..." : "新規"}
            </Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <Text style={styles.loadingText}>記録を取得中...</Text>
        )}

        {error && (
          <Text style={styles.errorText}>
            記録の取得に失敗しました: {error.message}
          </Text>
        )}

        {data?.currentUser?.workoutLogs && data.currentUser.workoutLogs.length > 0 ? (
          data.currentUser.workoutLogs.map((workoutLog) => {
            const expandedWorkout = expandedWorkouts.find(w => w.id === workoutLog.id) || {
              id: workoutLog.id,
              isExpanded: false,
              selectedWorkoutType: '',
              weight: '',
              repCount: '',
            };

            return (
              <View key={workoutLog.id} style={styles.workoutCard}>
                <View style={styles.workoutCardHeader}>
                  <Text style={styles.workoutDate}>
                    {formatDate(workoutLog.createdAt)}
                  </Text>
                  <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => toggleWorkoutExpansion(workoutLog.id)}
                  >
                    <FontAwesome
                      name={expandedWorkout.isExpanded ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={theme.text}
                    />
                  </TouchableOpacity>
                </View>

                {/* 既存のセット記録（サーバーデータ） */}
                {workoutLog.setLogs.map((setLog) => (
                  <View key={setLog.id} style={styles.setLogItem}>
                    <Text style={styles.setLogText}>
                      {setLog.workoutType.name}
                    </Text>
                    <Text style={styles.setLogText}>
                      {setLog.weight}kg × {setLog.repCount}回 (セット{setLog.setNumber})
                    </Text>
                  </View>
                ))}

                {/* 追加したセット記録（ローカルデータ） */}
                {expandedWorkout.isExpanded && (
                  <>
                    <FormField
                      label="筋トレ種目"
                      value={expandedWorkout.selectedWorkoutType}
                      onChangeText={(value) => updateWorkoutForm(workoutLog.id, 'selectedWorkoutType', value)}
                      type="picker"
                      pickerOptions={workoutTypesData?.workoutTypes.map((workoutType) => ({
                        label: workoutType.name,
                        value: workoutType.id,
                      })) || []}
                      placeholder="筋トレ種目を選択"
                      marginBottom={6}
                    />

                    <View style={styles.rowContainer}>
                      <View style={styles.halfWidth}>
                        <FormField
                          label="重量 (kg)"
                          value={expandedWorkout.weight}
                          onChangeText={(value) => updateWorkoutForm(workoutLog.id, 'weight', value)}
                          type="number"
                          placeholder="例: 100"
                          marginBottom={0}
                        />
                      </View>
                      <View style={styles.halfWidth}>
                        <FormField
                          label="回数"
                          value={expandedWorkout.repCount}
                          onChangeText={(value) => updateWorkoutForm(workoutLog.id, 'repCount', value)}
                          type="number"
                          placeholder="例: 10"
                          marginBottom={0}
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleAddSetLog(workoutLog.id)}
                      disabled={addingSetLog}
                    >
                      <Text style={styles.addButtonText}>
                        {addingSetLog ? '追加中...' : 'セットを追加'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name="list" size={48} color={theme.textSecondary} />
            <Text style={styles.emptyStateText}>
              まだ筋トレ記録がありません。{'\n'}
              新しい筋トレを開始してみましょう！
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}