import { Text, View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useAuth, useWorkoutStats } from "../../hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../theme";
import { LoadingState, ErrorState, EmptyState, AdBanner } from "../ui";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  summarySection: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: theme.surfaceVariant,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  recentWorkoutSection: {
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
  recentWorkoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },
  recentWorkoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  recentWorkoutIcon: {
    marginRight: 12,
  },
  recentWorkoutInfo: {
    flex: 1,
  },
  recentWorkoutDate: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
  recentWorkoutExercises: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  quickActionsSection: {
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
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },
  quickActionButton: {
    backgroundColor: theme.surfaceVariant,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionButtonText: {
    color: theme.text,
    fontSize: 14,
    marginLeft: 8,
  },
});

export function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const { userData, refetch, loading, error, ...workoutStats } = useWorkoutStats(user?.uid);

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

  // ユーザーが未認証の場合は何も表示しない（ログイン画面に遷移中）
  if (!user) {
    return null;
  }

  // データローディング中の表示
  if (loading && !userData) {
    return (
      <LoadingState title="データを読み込み中..." />
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <ErrorState
        title="データの読み込みに失敗しました"
        errorMessage={error.message}
        onRetry={() => refetch()}
      />
    );
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
      {/* ウェルカムセクション */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>ようこそ、{userData?.profile?.name || 'ユーザー'}さん</Text>
        <Text style={styles.welcomeSubtitle}>今日も筋トレを頑張りましょう！</Text>
      </View>

      {/* 広告セクション */}
      <AdBanner />

      {/* 今週の活動サマリーセクション */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>今週の活動サマリー</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{workoutStats.thisWeekCount}</Text>
            <Text style={styles.summaryLabel}>今週のトレ</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{workoutStats.thisWeekSets}</Text>
            <Text style={styles.summaryLabel}>今週のセット</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{workoutStats.streakDays}</Text>
            <Text style={styles.summaryLabel}>連続日数</Text>
          </View>
        </View>
      </View>

      {/* 最近のトレーニングセクション */}
      <View style={styles.recentWorkoutSection}>
        <Text style={styles.recentWorkoutTitle}>最近のトレーニング</Text>
        {workoutStats.recentWorkouts.length > 0 ? (
          workoutStats.recentWorkouts.map((workout, index) => (
            <TouchableOpacity
              key={workout.id}
              style={styles.recentWorkoutItem}
              onPress={() => router.push("/(tabs)/workout")}
            >
              <FontAwesome name="bar-chart" size={16} color={theme.text} style={styles.recentWorkoutIcon} />
              <View style={styles.recentWorkoutInfo}>
                <Text style={styles.recentWorkoutDate}>
                  {(() => {
                    try {
                      if (workout.date) {
                        return `${dayjs(workout.date, 'YYYY-MM-DD').format('MM/DD')} (${dayjs(workout.date, 'YYYY-MM-DD').fromNow()})`;
                      } else if (workout.createdAt) {
                        return `${dayjs(workout.createdAt).format('MM/DD')} (${dayjs(workout.createdAt).fromNow()})`;
                      }
                      return '日付不明';
                    } catch (error) {
                      console.error('Date parsing error:', error);
                      return '日付エラー';
                    }
                  })()}
                </Text>
                <Text style={styles.recentWorkoutExercises}>
                  {workout.workoutExercises.length}種目
                  {workout.workoutGroup && ` • ${workout.workoutGroup.title}`}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <EmptyState
            icon="calendar"
            title="まだトレーニング記録がありません"
            message="今日からトレーニングを始めてみましょう！"
          />
        )}
      </View>
    </ScrollView>
  );
}