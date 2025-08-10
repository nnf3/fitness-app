import { Text, View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useAuth } from "../../hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../theme";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: theme.text,
  },
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  createGroupButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  createGroupButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: theme.surfaceVariant,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  groupCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  groupDate: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupMemberCount: {
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 8,
  },
  groupActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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

export function GroupWorkoutScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

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
      // TODO: グループワークアウトデータの再取得
      console.log("グループワークアウトデータを再取得中...");
      // 実際の実装では、GraphQLクエリのrefetchを呼び出す
      await new Promise(resolve => setTimeout(resolve, 1000)); // 仮の遅延
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateGroup = () => {
    // TODO: グループ作成画面に遷移
    console.log("グループ作成画面に遷移");
  };

  const handleJoinGroup = (groupId: string) => {
    // TODO: グループ参加処理
    console.log("グループ参加:", groupId);
  };

  const handleViewGroup = (groupId: string) => {
    // TODO: グループ詳細画面に遷移
    console.log("グループ詳細画面に遷移:", groupId);
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
      {/* グループワークアウトセクション */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>グループワークアウト</Text>
          <TouchableOpacity
            style={styles.createGroupButton}
            onPress={handleCreateGroup}
          >
            <FontAwesome name="plus" size={12} color="#FFFFFF" />
            <Text style={styles.createGroupButtonText}>作成</Text>
          </TouchableOpacity>
        </View>

        {/* TODO: グループワークアウトのデータを取得して表示 */}
        <View style={styles.emptyState}>
          <FontAwesome name="users" size={48} color={theme.textSecondary} />
          <Text style={styles.emptyStateText}>
            まだグループワークアウトがありません。{'\n'}
            新しいグループを作成して友達と一緒にトレーニングしましょう！
          </Text>
        </View>

        {/* サンプルグループカード（開発用） */}
        <View style={styles.groupCard}>
          <View style={styles.groupCardHeader}>
            <Text style={styles.groupTitle}>サンプルグループ</Text>
            <Text style={styles.groupDate}>
              {new Date().toLocaleDateString('ja-JP')}
            </Text>
          </View>
          <View style={styles.groupInfo}>
            <FontAwesome name="users" size={16} color={theme.textSecondary} />
            <Text style={styles.groupMemberCount}>3人参加中</Text>
          </View>
          <View style={styles.groupActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleViewGroup("sample-group-id")}
            >
              <Text style={styles.actionButtonText}>詳細</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleJoinGroup("sample-group-id")}
            >
              <Text style={styles.actionButtonText}>参加</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
