import { Text, View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Modal, Image } from "react-native";
import {
  useAuth,
  useAvailableWorkoutGroups,
  useCreateWorkoutGroup,
} from "../../hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../theme";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CreateGroupForm } from "../forms";

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
  createGroupCard: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: theme.primary,
    borderStyle: 'dashed',
  },
  createGroupCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  createGroupCardText: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
  },
  groupCard: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  groupCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  groupImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: theme.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupCardHeader: {
    flex: 1,
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
    marginTop: 4,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupMemberCount: {
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.surface,
    padding: 24,
    borderRadius: 16,
    width: '80%',
    maxWidth: 400,
  },
});

export function GroupWorkoutScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const styles = createStyles(theme);

  // カスタムフックを使用
  const {
    joinedGroups,
    formatDate,
    loading,
    error,
    refetch
  } = useAvailableWorkoutGroups();

  const { createGroup, loading: createGroupLoading } = useCreateWorkoutGroup();

  // モーダル状態
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  // ログアウト時にログイン画面に遷移
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // 合トレグループデータの再取得
      await refetch();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateGroup = () => {
    setShowCreateGroupModal(true);
  };

  const handleCloseCreateGroupModal = () => {
    setShowCreateGroupModal(false);
  };

  const handleSubmitCreateGroup = async (data: { title: string; date?: string; imageUrl?: string }) => {
    try {
      const result = await createGroup(data);

      if (result.success) {
        // 成功時の処理
        Alert.alert('成功', 'グループを作成しました！');
        setShowCreateGroupModal(false);

        // データを再取得
        await refetch();
      } else {
        Alert.alert('エラー', 'グループの作成に失敗しました。');
      }
    } catch (error) {
      console.error('Create group error:', error);
      Alert.alert('エラー', 'グループの作成に失敗しました。');
    }
  };

  const handleViewGroup = (groupId: string) => {
    router.push(`/group-detail?groupId=${groupId}`);
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
      {/* 参加中のグループセクション */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>参加中のグループ</Text>
        </View>

        {/* 新規作成カード */}
        <TouchableOpacity
          style={styles.createGroupCard}
          onPress={handleCreateGroup}
        >
          <View style={styles.createGroupCardContent}>
            <FontAwesome name="plus-circle" size={24} color={theme.primary} />
            <Text style={styles.createGroupCardText}>
              グループを作成
            </Text>
          </View>
        </TouchableOpacity>

        {/* ローディング状態 */}
        {loading && (
          <Text style={styles.loadingText}>合トレグループを読み込み中...</Text>
        )}

        {/* エラー状態 */}
        {error && (
          <Text style={styles.errorText}>
            合トレグループの読み込みに失敗しました。
          </Text>
        )}

        {/* 参加中のグループ */}
        {joinedGroups.map((group) => (
          <TouchableOpacity
            key={group?.id}
            style={styles.groupCard}
            onPress={() => handleViewGroup(group?.id || '')}
          >
            <View style={styles.groupCardContent}>
              {group?.imageURL ? (
                <Image source={{ uri: group.imageURL }} style={styles.groupImage} />
              ) : (
                <View style={styles.groupImagePlaceholder}>
                  <FontAwesome name="users" size={24} color={theme.textSecondary} />
                </View>
              )}
              <View style={styles.groupCardHeader}>
                <Text style={styles.groupTitle}>{group?.title}</Text>
                <Text style={styles.groupDate}>
                  {group?.date ? formatDate(group.date) : '日付未設定'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* 空の状態 */}
        {!loading && !error && joinedGroups.length === 0 && (
          <View style={styles.emptyState}>
            <FontAwesome name="users" size={48} color={theme.textSecondary} />
            <Text style={styles.emptyStateText}>
              まだ参加中のグループがありません。{'\n'}
              新しいグループを作成して友達と一緒にトレーニングしましょう！
            </Text>
          </View>
        )}
      </View>

      {/* グループ作成モーダル */}
      <Modal
        visible={showCreateGroupModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseCreateGroupModal}
        presentationStyle="overFullScreen"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseCreateGroupModal}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <CreateGroupForm
              onSubmit={handleSubmitCreateGroup}
              onCancel={handleCloseCreateGroupModal}
              isLoading={createGroupLoading}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}
