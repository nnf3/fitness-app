import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks';
import { useTheme } from '../../theme';
import { useWorkoutGroup } from '../../hooks/useWorkoutGroup';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface GroupDetailScreenProps {
  groupId: string;
}

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
  groupInfoCard: {
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
  groupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  groupDate: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  groupCreatedAt: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  memberCard: {
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginLeft: 12,
  },
  memberDate: {
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 28,
    marginTop: 4,
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
});

export function GroupDetailScreen({ groupId }: GroupDetailScreenProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const styles = createStyles(theme);

  // グループ詳細データを取得
  const {
    workoutGroup,
    members,
    formatDate,
    formatDateTime,
    loading,
    error,
    refetch
  } = useWorkoutGroup(groupId);

  // ログアウト時にログイン画面に遷移
  if (!user) {
    router.replace("/login");
    return null;
  }

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

  const handleViewWorkout = (workoutId: string) => {
    // セット記録ページに遷移
    router.push(`/add-workout-record?workoutId=${workoutId}&groupId=${groupId}`);
  };

  if (loading) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.loadingText}>グループ情報を読み込み中...</Text>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.errorText}>
          グループ情報の読み込みに失敗しました: {error.message}
        </Text>
      </ScrollView>
    );
  }

  if (!workoutGroup) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.errorText}>グループが見つかりません</Text>
      </ScrollView>
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
      {/* グループ情報セクション */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>グループ情報</Text>
        </View>

        <View style={styles.groupInfoCard}>
          <Text style={styles.groupTitle}>{workoutGroup.title}</Text>
          {workoutGroup.date && (
            <Text style={styles.groupDate}>
              開催日: {formatDate(workoutGroup.date)}
            </Text>
          )}
          <Text style={styles.groupCreatedAt}>
            作成日: {formatDateTime(workoutGroup.createdAt)}
          </Text>
        </View>
      </View>

      {/* メンバーセクション */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>メンバー</Text>
        </View>

        {members.length > 0 ? (
          members.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={styles.memberCard}
              onPress={() => handleViewWorkout(member.workoutId)}
            >
              <View style={styles.memberHeader}>
                <FontAwesome name="user" size={16} color={theme.textSecondary} />
                <Text style={styles.memberName}>{member.userName}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name="users" size={48} color={theme.textSecondary} />
            <Text style={styles.emptyStateText}>
              まだメンバーがいません。{'\n'}
              グループに参加してワークアウトを開始しましょう！
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
