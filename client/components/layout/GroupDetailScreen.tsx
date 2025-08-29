import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  useAuth,
  useFirebaseStorage,
  useWorkoutGroup,
  useAddWorkoutGroupMember,
  useUpdateWorkoutGroup,
  useDeleteWorkoutGroup,
} from '../../hooks';
import { useTheme } from '../../theme';
import { LoadingState, ErrorState, EmptyState } from '../ui';
import { FriendSelectionModal } from '../ui/FriendSelectionModal';
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  addMemberButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.primary,
    marginLeft: 4,
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
  groupInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
  },
  groupAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primaryVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  groupAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  groupAvatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  groupInfoText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  saveButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    width: 100,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  memberCard: {
    backgroundColor: theme.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
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
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primaryVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  memberAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  memberAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  memberStatus: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  deleteButton: {
    backgroundColor: theme.error,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    loading,
    error,
    refetch
  } = useWorkoutGroup(groupId);

  // メンバー追加機能
  const { addMember, loading: addMemberLoading } = useAddWorkoutGroupMember();
  const { updateGroup, loading: updateGroupLoading } = useUpdateWorkoutGroup();
  const { deleteGroup, loading: deleteGroupLoading } = useDeleteWorkoutGroup();
  const { uploadImage } = useFirebaseStorage();

  // モーダル状態
  const [showFriendSelectionModal, setShowFriendSelectionModal] = useState(false);

  // 画像変更状態
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [hasImageChanges, setHasImageChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 既存メンバーのIDリスト（ユーザーID）
  const existingMemberIds = members.map(member => member.userId);

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

  const handleAddMember = () => {
    setShowFriendSelectionModal(true);
  };

  const handleSelectFriend = async (friend: any) => {
    try {
      const result = await addMember(groupId, friend.id);

      if (result.success) {
        Alert.alert('成功', `${friend.profile?.name || '名前未設定'}をグループに追加しました！`);
        // データを再取得
        await refetch();
      } else {
        Alert.alert('エラー', 'メンバーの追加に失敗しました。');
      }
    } catch (error) {
      console.error('Add member error:', error);
      Alert.alert('エラー', 'メンバーの追加に失敗しました。');
    }
  };

  const handleImageSelect = async () => {
    // カメラロールへのアクセス許可をリクエスト
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('権限が必要です', '写真を選択するにはカメラロールへのアクセス許可が必要です。');
      return;
    }

    // 画像選択を実行
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      try {
        setIsUploading(true);
        // Firebase Storageにアップロード
        const uploadResult = await uploadImage(
          imageUri,
          `groups/${user?.uid}/group-images`,
          {
            customMetadata: {
              uploadedAt: new Date().toISOString(),
              userId: user?.uid || '',
            },
          }
        );

        // アップロード成功後、URLを編集データに設定
        setEditedImageUrl(uploadResult.url);
        setHasImageChanges(true);
        Alert.alert('成功', '画像をアップロードしました');
      } catch (error) {
        console.error('Image upload failed:', error);
        Alert.alert('エラー', '画像のアップロードに失敗しました');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveImage = async () => {
    if (!workoutGroup) return;

    try {
      const result = await updateGroup({
        id: workoutGroup.id,
        imageUrl: editedImageUrl || undefined,
      });

      if (result.success) {
        Alert.alert('成功', '画像を保存しました！');
        setHasImageChanges(false);
        // データを再取得
        await refetch();
      } else {
        Alert.alert('エラー', '画像の保存に失敗しました。');
      }
    } catch (error) {
      console.error('Update group error:', error);
      Alert.alert('エラー', '画像の保存に失敗しました。');
    }
  };

  const handleDeleteGroup = async () => {
    if (!workoutGroup) return;

    Alert.alert(
      'グループを削除',
      `「${workoutGroup.title}」を削除しますか？\nこの操作は取り消せません。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await deleteGroup(workoutGroup.id);

              if (result.success) {
                Alert.alert('成功', 'グループを削除しました', [
                  {
                    text: 'OK',
                    onPress: () => {
                      // 前の画面に戻る
                      router.back();
                    }
                  }
                ]);
              } else {
                Alert.alert('エラー', 'グループの削除に失敗しました');
              }
            } catch (error) {
              console.error('Delete group error:', error);
              Alert.alert('エラー', 'グループの削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <LoadingState title="グループ情報を読み込み中..." />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="グループ情報の読み込みに失敗しました"
        errorMessage={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  if (!workoutGroup) {
    return (
      <ErrorState
        title="グループが見つかりません"
        errorMessage="指定されたグループは存在しないか、アクセス権限がありません"
      />
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
          <View style={styles.groupInfoContent}>
            <TouchableOpacity onPress={handleImageSelect} disabled={isUploading}>
              {(editedImageUrl || workoutGroup.imageURL) ? (
                <View style={styles.groupAvatar}>
                  <Image
                    source={{ uri: (editedImageUrl || workoutGroup.imageURL) || '' }}
                    style={styles.groupAvatarImage}
                  />
                </View>
              ) : (
                <View style={styles.groupAvatar}>
                  <Text style={styles.groupAvatarText}>{workoutGroup.title.charAt(0)}</Text>
                </View>
              )}
              {isUploading && (
                <View style={styles.uploadOverlay}>
                  <FontAwesome name="spinner" size={20} color="#FFFFFF" />
                  <Text style={styles.uploadText}>アップロード中...</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.groupInfoText}>
              <Text
                style={styles.groupTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {workoutGroup.title}
              </Text>
              {workoutGroup.date && (
                <Text style={styles.groupDate}>
                  開催日: {formatDate(workoutGroup.date)}
                </Text>
              )}
            </View>
            {hasImageChanges && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveImage}
                disabled={updateGroupLoading}
              >
                <Text style={styles.saveButtonText}>
                  {updateGroupLoading ? '保存中...' : '保存する'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* メンバーセクション */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>メンバー</Text>
            <TouchableOpacity
              style={styles.addMemberButton}
              onPress={handleAddMember}
              disabled={addMemberLoading}
            >
              <FontAwesome name="user-plus" size={16} color={theme.primary} />
              <Text style={styles.addMemberButtonText}>追加</Text>
            </TouchableOpacity>
          </View>
        </View>

        {members.length > 0 ? (
          members.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={styles.memberCard}
              onPress={() => handleViewWorkout(member.workoutId)}
            >
              <View style={styles.memberHeader}>
                {member.profileImageURL ? (
                  <View style={styles.memberAvatar}>
                    <Image source={{ uri: member.profileImageURL }} style={styles.memberAvatarImage} />
                  </View>
                ) : (
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberAvatarText}>{member.userName.charAt(0)}</Text>
                  </View>
                )}
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.userName}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <EmptyState
            title="まだメンバーがいません"
            message="グループに参加してワークアウトを開始しましょう！"
            icon="users"
          />
        )}
      </View>

      {/* 削除ボタン */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteGroup}
        disabled={deleteGroupLoading}
      >
        <Text style={styles.deleteButtonText}>
          {deleteGroupLoading ? '削除中...' : 'グループを削除'}
        </Text>
      </TouchableOpacity>

      {/* フレンド選択モーダル */}
      <FriendSelectionModal
        visible={showFriendSelectionModal}
        onClose={() => setShowFriendSelectionModal(false)}
        onSelectFriend={handleSelectFriend}
        groupId={groupId}
        existingMemberIds={existingMemberIds}
      />
    </ScrollView>
  );
}
