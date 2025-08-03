import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAuth, useWorkout } from "../../hooks";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTheme } from "../../theme";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { WorkoutForm } from "@/components/forms";

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
});

export function WorkoutScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  const {
    data,
    loading,
    error,
    workoutTypesData,
    startingWorkout,
    addingSetLog,
    handleStartWorkout,
    toggleWorkoutExpansion,
    handleAddSetLog,
    updateWorkoutForm,
    getExpandedWorkout,
  } = useWorkout(user);

  const styles = createStyles(theme);

  // ログアウト時にログイン画面に遷移
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

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
            const expandedWorkout = getExpandedWorkout(workoutLog.id);

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
                {workoutLog.setLogs.slice(0, expandedWorkout.isExpanded ? undefined : 3).map((setLog) => (
                  <View key={setLog.id} style={styles.setLogItem}>
                    <Text style={styles.setLogText}>
                      {setLog.workoutType.name}
                    </Text>
                    <Text style={styles.setLogText}>
                      {setLog.weight}kg × {setLog.repCount}回 (セット{setLog.setNumber})
                    </Text>
                  </View>
                ))}

                {/* 展開していない時で、セット記録が3件を超える場合に「...」を表示 */}
                {!expandedWorkout.isExpanded && workoutLog.setLogs.length > 3 && (
                  <View style={styles.setLogItem}>
                    <Text style={styles.setLogText}>
                      ... 他 {workoutLog.setLogs.length - 3} 件
                    </Text>
                  </View>
                )}

                {expandedWorkout.isExpanded && (
                  <WorkoutForm
                    workoutId={workoutLog.id}
                    selectedWorkoutType={expandedWorkout.selectedWorkoutType}
                    weight={expandedWorkout.weight}
                    repCount={expandedWorkout.repCount}
                    onUpdateForm={(field, value) => updateWorkoutForm(workoutLog.id, field, value)}
                    onSubmit={() => handleAddSetLog(workoutLog.id)}
                    loading={addingSetLog}
                    workoutTypesData={workoutTypesData}
                  />
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