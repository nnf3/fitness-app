import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FormField } from './FormField';
import { useTheme } from '../../theme';

interface SetLogFormData {
  weight: string;
  repCount: string;
}

interface SetLogFormProps {
  formData: SetLogFormData;
  onUpdateForm: (field: keyof SetLogFormData, value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  selectedExercise: string;
  nextSetNumber: number;
  disabled?: boolean;
}

const createStyles = (theme: any) => StyleSheet.create({
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    backgroundColor: theme.textSecondary,
  },
  infoText: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
});

export function SetLogForm({
  formData,
  onUpdateForm,
  onSubmit,
  loading,
  selectedExercise,
  nextSetNumber,
  disabled = false,
}: SetLogFormProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const isFormValid = selectedExercise && formData.weight && formData.repCount && !disabled;

  return (
    <View style={styles.formSection}>
      <View style={styles.rowContainer}>
        <View style={styles.halfWidth}>
          <FormField
            label="重量 (kg)"
            value={formData.weight}
            onChangeText={(value) => onUpdateForm('weight', value)}
            type="number"
            placeholder="例: 100"
            marginBottom={0}
          />
        </View>
        <View style={styles.halfWidth}>
          <FormField
            label="回数"
            value={formData.repCount}
            onChangeText={(value) => onUpdateForm('repCount', value)}
            type="number"
            placeholder="例: 10"
            marginBottom={0}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!isFormValid || loading) && styles.submitButtonDisabled
        ]}
        onPress={onSubmit}
        disabled={!isFormValid || loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? '追加中...' : 'セットを追加'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
