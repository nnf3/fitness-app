import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@apollo/client';
import { useAuth } from '../../hooks';
import { useWorkout } from '../../hooks/useWorkout';
import { useTheme } from '../../theme';
import { WorkoutsDocument } from '../../documents';
import { WorkoutsQuery } from '../../types/graphql';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DateField } from '../forms';
import dayjs from 'dayjs';

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  createWorkoutCard: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: theme.primary,
    borderStyle: 'dashed',
  },
  createWorkoutCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  createWorkoutCardText: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
  },
  workoutCard: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workoutCardHeader: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.surface,
    padding: 24,
    borderRadius: 16,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  datePickerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: theme.primary,
  },
  modalButtonSecondary: {
    backgroundColor: theme.surfaceVariant,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextPrimary: {
    color: '#FFFFFF',
  },
  modalButtonTextSecondary: {
    color: theme.text,
  },
});

export function WorkoutScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateWorkoutModal, setShowCreateWorkoutModal] = useState(false);

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

  const handleCreateWorkout = async () => {
    // DateFieldと同じ方法で日付文字列を作成
    const dateString = dayjs(selectedDate).format('YYYY-MM-DD');

    try {
      await handleStartWorkout(
        dateString,
        undefined, // workoutGroupID
        undefined, // userId
        (workoutId: string) => {
          // 成功時のみ遷移
          router.push({
            pathname: '/add-workout-record',
            params: { workoutId }
          });
        }
      );
    } catch (error) {
      // エラーはuseWorkoutフックで処理される
      console.error('Failed to create workout:', error);
    }
  };

  const handleOpenCreateWorkoutModal = () => {
    setShowCreateWorkoutModal(true);
  };

  const handleCloseCreateWorkoutModal = () => {
    setShowCreateWorkoutModal(false);
  };

  const handleConfirmCreateWorkout = () => {
    handleCreateWorkout();
    handleCloseCreateWorkoutModal();
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
        </View>

        {/* 新規追加カード */}
        <TouchableOpacity
          style={styles.createWorkoutCard}
          onPress={handleOpenCreateWorkoutModal}
        >
          <View style={styles.createWorkoutCardContent}>
            <FontAwesome name="plus-circle" size={24} color={theme.primary} />
            <Text style={styles.createWorkoutCardText}>
              筋トレをはじめる
            </Text>
          </View>
        </TouchableOpacity>

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

      {/* 新規筋トレ追加モーダル */}
      <Modal
        visible={showCreateWorkoutModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseCreateWorkoutModal}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.datePickerContainer}>
              <DateField
                label="日付"
                value={selectedDate}
                onChange={setSelectedDate}
                mode="date"
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={handleCloseCreateWorkoutModal}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                  キャンセル
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleConfirmCreateWorkout}
                disabled={startingWorkout}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  {startingWorkout ? "開始中..." : "追加"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}