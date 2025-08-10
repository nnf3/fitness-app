import React from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTheme } from '../../theme';
import { AddWorkoutRecordScreen } from '../../components/layout';
import { useWorkoutGroupTitle } from '../../hooks/useWorkoutGroup';

export default function AddWorkoutRecordPage() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const workoutId = params.workoutId as string;
  const groupId = params.groupId as string;

  // グループ情報を取得
  const { groupTitle } = useWorkoutGroupTitle(groupId);

  // 戻るボタンのテキストを決定
  const getBackTitle = () => {
    if (groupId && groupTitle) {
      return groupTitle;
    }
    return '個人トレ';
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'セット記録',
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.text,
          },
          headerTintColor: theme.text,
          headerBackTitle: getBackTitle(),
        }}
      />
      <AddWorkoutRecordScreen workoutId={workoutId} groupId={groupId} />
    </>
  );
}
