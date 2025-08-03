import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../hooks";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { WorkoutLogsDocument, StartWorkoutDocument } from "@/documents";
import { WorkoutLogsQuery, StartWorkoutMutation } from "@/types/graphql";
import { useTheme } from "../../theme";
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },
  startWorkoutButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  startWorkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  workoutCard: {
    backgroundColor: theme.surfaceVariant,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  workoutDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  setLogItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
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

  const { data, loading, error, refetch } = useQuery<WorkoutLogsQuery>(WorkoutLogsDocument, {
    skip: !user,
  });

  const [startWorkout, { loading: startingWorkout }] = useMutation<StartWorkoutMutation>(StartWorkoutDocument, {
    onCompleted: (data) => {
      if (data?.startWorkout) {
        Alert.alert(
          "筋トレ開始",
          "新しい筋トレセッションを開始しました！",
          [
            {
              text: "記録を追加",
              onPress: () => router.push("/workout-form"),
            },
            {
              text: "後で",
              style: "cancel",
            },
          ]
        );
        refetch();
      }
    },
    onError: (error) => {
      Alert.alert("エラー", `筋トレの開始に失敗しました: ${error.message}`);
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
      {/* 新しい筋トレ開始セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>新しい筋トレ</Text>
        <TouchableOpacity
          style={styles.startWorkoutButton}
          onPress={handleStartWorkout}
          disabled={startingWorkout}
        >
          <FontAwesome name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.startWorkoutButtonText}>
            {startingWorkout ? "開始中..." : "筋トレを開始"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 筋トレ履歴セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>筋トレ履歴</Text>

        {loading && (
          <Text style={styles.loadingText}>記録を取得中...</Text>
        )}

        {error && (
          <Text style={styles.errorText}>
            記録の取得に失敗しました: {error.message}
          </Text>
        )}

        {data?.currentUser?.workoutLogs && data.currentUser.workoutLogs.length > 0 ? (
          data.currentUser.workoutLogs.map((workoutLog) => (
            <View key={workoutLog.id} style={styles.workoutCard}>
              <Text style={styles.workoutDate}>
                {formatDate(workoutLog.createdAt)}
              </Text>
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
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name="headphones" size={48} color={theme.textSecondary} />
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