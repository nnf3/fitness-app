import { Text, View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useAuth, useWorkout } from "../../hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../theme";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQuery } from "@apollo/client";
import { WorkoutsDocument } from "@/documents";
import { WorkoutsQuery } from "@/types/graphql";

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
    borderWidth: 1,
    borderColor: theme.border,
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
  exerciseListContainer: {
    marginTop: 8,
  },
  exerciseListText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
});

export function WorkoutScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // 直接useQueryを使用してrefetchを取得
  const { refetch } = useQuery(WorkoutsDocument, {
    skip: !user,
  });

  const {
    data,
    loading,
    error,
    startingWorkout,
    handleStartWorkout,
  } = useWorkout(user);

  const styles = createStyles(theme);

  // ログアウト時にログイン画面に遷移
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getWorkoutDate = (workout: WorkoutsQuery['currentUser']['workouts'][0]) => {
    // dateフィールドが存在する場合はそれを使用、存在しない場合はcreatedAtを使用
    const dateToUse = workout.date || workout.createdAt;
    return formatDate(dateToUse);
  };

  const handleWorkoutCardPress = (workoutId: string) => {
    router.push({
      pathname: '/add-workout-record',
      params: { workoutId }
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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.primary]}
          tintColor={theme.primary}
        />
      }
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

        {data?.currentUser?.workouts && data.currentUser.workouts.length > 0 ? (
          data.currentUser.workouts.map((workout) => {
            return (
              <TouchableOpacity
                key={workout.id}
                style={styles.workoutCard}
                onPress={() => handleWorkoutCardPress(workout.id)}
              >
                <View style={styles.workoutCardHeader}>
                  <Text style={styles.workoutDate}>
                    {getWorkoutDate(workout)}
                  </Text>
                </View>

                {/* 種目一覧を表示 */}
                <View style={styles.exerciseListContainer}>
                  <Text style={styles.exerciseListText} numberOfLines={1}>
                    {[...new Set(
                      workout.workoutExercises.flatMap(we =>
                        we.setLogs.map(() => we.exercise.name)
                      )
                    )].join('、')}
                  </Text>
                </View>
              </TouchableOpacity>
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