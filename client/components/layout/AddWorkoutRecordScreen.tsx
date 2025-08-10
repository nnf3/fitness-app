import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks';
import { useWorkout } from '../../hooks/useWorkout';
import { useTheme } from '../../theme';
import { SetLogForm } from '../forms';

interface AddWorkoutRecordScreenProps {
  workoutId: string;
  groupId?: string;
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
    padding: 20,
  },
  tabContainer: {
    backgroundColor: theme.surfaceVariant,
    borderRadius: 8,
    marginBottom: 20,
    padding: 4,
  },
  tabScrollView: {
    flexDirection: 'row',
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 3,
    minWidth: 100,
  },
  tabButtonActive: {
    backgroundColor: theme.primary,
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabTextInactive: {
    color: theme.textSecondary,
  },
  historySection: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 20,
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
    marginBottom: 16,
  },
  setLogItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.surfaceVariant,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    flex: 1,
  },
  setLogDetails: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  emptyHistoryText: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export function AddWorkoutRecordScreen({ workoutId, groupId }: AddWorkoutRecordScreenProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    weight: '',
    repCount: '',
  });

  const [loading, setLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string>('');

  const styles = createStyles(theme);

  // useWorkoutフックを使用
  const {
    exercisesData,
    handleAddSetLog,
    getAvailableExercises,
    getSelectedExerciseSetLogs,
    getNextSetNumber,
  } = useWorkout(user);

  // ログアウト時にログイン画面に遷移
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  // 利用可能な種目のリスト
  const availableExercises = useMemo(() => {
    return getAvailableExercises(workoutId);
  }, [getAvailableExercises, workoutId]);

  // 選択された種目のセット記録を取得
  const selectedExerciseSetLogs = useMemo(() => {
    if (!selectedExercise) return [];
    return getSelectedExerciseSetLogs(workoutId, selectedExercise);
  }, [selectedExercise, getSelectedExerciseSetLogs, workoutId]);

  // 選択された種目に対応するエクササイズIDを取得
  const selectedExerciseId = useMemo(() => {
    if (!selectedExercise) return '';
    return exercisesData?.exercises?.find(ex => ex.name === selectedExercise)?.id || '';
  }, [selectedExercise, exercisesData]);

  // 次のセット番号を計算
  const nextSetNumber = useMemo(() => {
    if (!selectedExercise) return 1;
    return getNextSetNumber(workoutId, selectedExercise);
  }, [selectedExercise, getNextSetNumber, workoutId]);

  // 初期種目を設定
  useEffect(() => {
    if (availableExercises.length > 0 && !selectedExercise) {
      setSelectedExercise(availableExercises[0]);
    }
  }, [availableExercises, selectedExercise]);

  const updateForm = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedExercise || !formData.weight || !formData.repCount) {
      Alert.alert('エラー', '種目を選択し、重量と回数を入力してください。');
      return;
    }

    if (!selectedExerciseId) {
      Alert.alert('エラー', '選択された種目が見つかりません。');
      return;
    }

    setLoading(true);

    try {
      await handleAddSetLog(
        workoutId,
        selectedExerciseId,
        parseFloat(formData.weight),
        parseInt(formData.repCount),
        nextSetNumber
      );

      Alert.alert(
        '成功',
        'セット記録を追加しました！',
        [
          {
            text: 'OK',
            onPress: () => {
              // フォームをリセット
              setFormData({
                weight: '',
                repCount: '',
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('エラー', `セット記録の追加に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 種目タブ切り替え */}
        <View style={styles.tabContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollView}
          >
            {availableExercises.map((exerciseName) => (
              <TouchableOpacity
                key={exerciseName}
                style={[
                  styles.tabButton,
                  selectedExercise === exerciseName ? styles.tabButtonActive : styles.tabButtonInactive
                ]}
                onPress={() => setSelectedExercise(exerciseName)}
              >
                <Text style={[
                  styles.tabText,
                  selectedExercise === exerciseName ? styles.tabTextActive : styles.tabTextInactive
                ]}>
                  {exerciseName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* セット記録入力フォーム */}
        <SetLogForm
          formData={formData}
          onUpdateForm={updateForm}
          onSubmit={handleSubmit}
          loading={loading}
          selectedExercise={selectedExercise}
          nextSetNumber={nextSetNumber}
          disabled={!selectedExercise}
        />

        {/* 過去のセット記録セクション */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>過去のセット記録</Text>

          {selectedExerciseSetLogs.length > 0 ? (
            selectedExerciseSetLogs.map((setLog) => (
              <View key={setLog.id} style={styles.setLogItem}>
                <Text style={styles.exerciseName}>
                  {setLog.exercise.name}
                </Text>
                <Text style={styles.setLogDetails}>
                  {setLog.weight}kg × {setLog.repCount}回 (セット{setLog.setNumber})
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyHistoryText}>
              {selectedExercise ? `${selectedExercise}のセット記録がありません` : '種目を選択してください'}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
