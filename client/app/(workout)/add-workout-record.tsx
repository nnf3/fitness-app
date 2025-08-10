import React from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTheme } from '../../theme';
import { AddWorkoutRecordScreen } from '../../components/layout';

export default function AddWorkoutRecordPage() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const workoutId = params.workoutId as string;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'セット記録を追加',
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.text,
          },
          headerTintColor: theme.text,
          headerBackTitle: '個人トレ',
        }}
      />
      <AddWorkoutRecordScreen workoutId={workoutId} />
    </>
  );
}
