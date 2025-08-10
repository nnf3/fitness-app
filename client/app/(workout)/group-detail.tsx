import React from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTheme } from '../../theme';
import { GroupDetailScreen } from '../../components/layout';
import { useWorkoutGroup } from '../../hooks/useWorkoutGroup';

export default function GroupDetailPage() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const groupId = params.groupId as string;

  // グループデータを取得してヘッダータイトルを設定
  const { workoutGroup } = useWorkoutGroup(groupId);

  return (
    <>
      <Stack.Screen
        options={{
          title: workoutGroup?.title || 'グループ詳細',
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.text,
          },
          headerTintColor: theme.text,
          headerBackTitle: '合トレ',
        }}
      />
      <GroupDetailScreen groupId={groupId} />
    </>
  );
}
