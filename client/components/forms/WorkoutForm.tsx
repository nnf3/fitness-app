import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FormField } from './FormField';
import { useTheme } from '../../theme';
import { WorkoutTypesQuery } from '@/types/graphql';

interface WorkoutFormProps {
  workoutId: string;
  selectedWorkoutType: string;
  weight: string;
  repCount: string;
  onUpdateForm: (field: keyof WorkoutFormData, value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  workoutTypesData?: WorkoutTypesQuery;
}

interface WorkoutFormData {
  selectedWorkoutType: string;
  weight: string;
  repCount: string;
}

const createStyles = (theme: any) => StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  halfWidth: {
    flex: 1,
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
});

export function WorkoutForm({
  workoutId,
  selectedWorkoutType,
  weight,
  repCount,
  onUpdateForm,
  onSubmit,
  loading,
  workoutTypesData,
}: WorkoutFormProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <>
      <FormField
        label="筋トレ種目"
        value={selectedWorkoutType}
        onChangeText={(value) => onUpdateForm('selectedWorkoutType', value)}
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
            value={weight}
            onChangeText={(value) => onUpdateForm('weight', value)}
            type="number"
            placeholder="例: 100"
            marginBottom={0}
          />
        </View>
        <View style={styles.halfWidth}>
          <FormField
            label="回数"
            value={repCount}
            onChangeText={(value) => onUpdateForm('repCount', value)}
            type="number"
            placeholder="例: 10"
            marginBottom={0}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.addButtonText}>
          {loading ? '追加中...' : 'セットを追加'}
        </Text>
      </TouchableOpacity>
    </>
  );
}