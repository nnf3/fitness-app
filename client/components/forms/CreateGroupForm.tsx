import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../theme';
import { DateField } from './DateField';
import dayjs from 'dayjs';

interface CreateGroupFormProps {
  onSubmit: (data: { title: string; date?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    // モーダル内で使用するため、背景色は不要
    padding: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: theme.surfaceVariant,
  },
  submitButton: {
    backgroundColor: theme.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: theme.textSecondary,
  },
  submitButtonText: {
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: theme.textSecondary,
  },
});

export function CreateGroupForm({ onSubmit, onCancel, isLoading = false }: CreateGroupFormProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('エラー', 'グループ名を入力してください');
      return;
    }

    onSubmit({
      title: title.trim(),
      date: date ? dayjs(date).format('YYYY-MM-DD') : undefined,
    });
  };

  const isSubmitDisabled = !title.trim() || isLoading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>新しいグループを作成</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>グループ名 *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="グループ名を入力"
          placeholderTextColor={theme.textSecondary}
          maxLength={50}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>開催日</Text>
        <DateField
          value={date}
          onChange={setDate}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>キャンセル</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.submitButton,
            isSubmitDisabled && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? '作成中...' : '作成'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
