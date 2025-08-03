import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { WorkoutTypesDocument, AddSetLogDocument } from '@/documents';
import { WorkoutTypesQuery, AddSetLogMutation } from '@/types/graphql';
import { useTheme } from '../../theme';
import { Picker } from '@react-native-picker/picker';

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  formSection: {
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
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.text,
    backgroundColor: theme.surfaceVariant,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    backgroundColor: theme.surfaceVariant,
  },
  addButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  setLogItem: {
    backgroundColor: theme.surfaceVariant,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setLogText: {
    fontSize: 14,
    color: theme.text,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: theme.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.error,
    marginBottom: 20,
  },
});

interface SetLog {
  workoutTypeID: string;
  workoutTypeName: string;
  weight: string;
  repCount: string;
  setNumber: number;
}

export function WorkoutForm() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [setLogs, setSetLogs] = useState<SetLog[]>([]);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('');
  const [weight, setWeight] = useState('');
  const [repCount, setRepCount] = useState('');

  const { data: workoutTypesData, loading: loadingWorkoutTypes, error: workoutTypesError } = useQuery<WorkoutTypesQuery>(WorkoutTypesDocument);

  const [addSetLog, { loading: addingSetLog }] = useMutation<AddSetLogMutation>(AddSetLogDocument, {
    onCompleted: (data) => {
      if (data?.addSetLog) {
        Alert.alert('成功', 'セット記録を追加しました！');
        // フォームをリセット
        setSelectedWorkoutType('');
        setWeight('');
        setRepCount('');
      }
    },
    onError: (error) => {
      Alert.alert('エラー', `セット記録の追加に失敗しました: ${error.message}`);
    },
  });

  const handleAddSetLog = () => {
    if (!selectedWorkoutType || !weight || !repCount) {
      Alert.alert('エラー', 'すべての項目を入力してください。');
      return;
    }

    const workoutType = workoutTypesData?.workoutTypes.find(wt => wt.id === selectedWorkoutType);
    if (!workoutType) {
      Alert.alert('エラー', '選択された筋トレ種目が見つかりません。');
      return;
    }

    const newSetLog: SetLog = {
      workoutTypeID: selectedWorkoutType,
      workoutTypeName: workoutType.name,
      weight,
      repCount,
      setNumber: setLogs.length + 1,
    };

    setSetLogs([...setLogs, newSetLog]);

    // フォームをリセット
    setSelectedWorkoutType('');
    setWeight('');
    setRepCount('');
  };

  const handleDeleteSetLog = (index: number) => {
    const newSetLogs = setLogs.filter((_, i) => i !== index);
    // セット番号を再計算
    const updatedSetLogs = newSetLogs.map((setLog, i) => ({
      ...setLog,
      setNumber: i + 1,
    }));
    setSetLogs(updatedSetLogs);
  };

  const handleSubmit = async () => {
    if (setLogs.length === 0) {
      Alert.alert('エラー', '少なくとも1つのセット記録を追加してください。');
      return;
    }

    // 各セット記録をサーバーに送信
    for (const setLog of setLogs) {
      try {
        await addSetLog({
          variables: {
            input: {
              workoutLogID: "1", // TODO: 実際のworkoutLogIDを取得する必要があります
              workoutTypeID: setLog.workoutTypeID,
              weight: parseFloat(setLog.weight),
              repCount: parseInt(setLog.repCount),
              setNumber: setLog.setNumber,
            },
          },
        });
      } catch (error) {
        console.error('セット記録の追加に失敗:', error);
      }
    }

    // 成功時の処理
    Alert.alert('成功', 'すべてのセット記録を追加しました！');
    setSetLogs([]);
  };

  if (loadingWorkoutTypes) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.label}>筋トレ種目を読み込み中...</Text>
      </View>
    );
  }

  if (workoutTypesError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          筋トレ種目の取得に失敗しました: {workoutTypesError.message}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* セット記録追加フォーム */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>新しいセット記録</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>筋トレ種目</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedWorkoutType}
              onValueChange={setSelectedWorkoutType}
              style={{ color: theme.text }}
            >
              <Picker.Item label="筋トレ種目を選択" value="" />
              {workoutTypesData?.workoutTypes.map((workoutType) => (
                <Picker.Item
                  key={workoutType.id}
                  label={workoutType.name}
                  value={workoutType.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>重量 (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="例: 50"
            keyboardType="numeric"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>回数</Text>
          <TextInput
            style={styles.input}
            value={repCount}
            onChangeText={setRepCount}
            placeholder="例: 10"
            keyboardType="numeric"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddSetLog}>
          <Text style={styles.addButtonText}>セットを追加</Text>
        </TouchableOpacity>
      </View>

      {/* 追加されたセット記録一覧 */}
      {setLogs.length > 0 && (
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>追加されたセット記録</Text>
          {setLogs.map((setLog, index) => (
            <View key={index} style={styles.setLogItem}>
              <Text style={styles.setLogText}>
                {setLog.workoutTypeName} - {setLog.weight}kg × {setLog.repCount}回 (セット{setLog.setNumber})
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteSetLog(index)}
              >
                <Text style={styles.deleteButtonText}>削除</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* 送信ボタン */}
      {setLogs.length > 0 && (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.secondary }]}
          onPress={handleSubmit}
          disabled={addingSetLog}
        >
          <Text style={styles.addButtonText}>
            {addingSetLog ? '送信中...' : '記録を保存'}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}