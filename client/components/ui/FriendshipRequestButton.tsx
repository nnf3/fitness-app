import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { SendFriendshipRequestDocument } from '@/documents';
import { SendFriendshipRequestMutation, SendFriendshipRequestMutationVariables } from '@/types/graphql';
import { useTheme } from '../../theme';
import { ConfirmModal } from './ConfirmModal';

interface FriendshipRequestButtonProps {
  requesteeId: string;
  requesteeName: string;
  onSuccess?: () => void;
}

export function FriendshipRequestButton({
  requesteeId,
  requesteeName,
  onSuccess,
}: FriendshipRequestButtonProps) {
  const { theme } = useTheme();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [sendFriendshipRequest, { loading: sendingRequest }] = useMutation<
    SendFriendshipRequestMutation,
    SendFriendshipRequestMutationVariables
  >(SendFriendshipRequestDocument);

  const handleRequestPress = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmRequest = async () => {
    try {
      await sendFriendshipRequest({
        variables: {
          input: {
            requesteeID: requesteeId,
          },
        },
      });
      Alert.alert('成功', 'フレンド申請を送信しました');
      setShowConfirmModal(false);
      onSuccess?.();
    } catch (error) {
      console.error('フレンド申請エラー:', error);
      Alert.alert('エラー', 'フレンド申請の送信に失敗しました');
    }
  };

  const handleCancelRequest = () => {
    setShowConfirmModal(false);
  };

  const styles = createStyles(theme);

  return (
    <>
      <TouchableOpacity
        style={styles.requestButton}
        onPress={handleRequestPress}
        disabled={sendingRequest}
      >
        <Text style={styles.requestButtonText}>
          {sendingRequest ? '送信中...' : '申請'}
        </Text>
      </TouchableOpacity>

      <ConfirmModal
        visible={showConfirmModal}
        title="フレンド申請の確認"
        message={`${requesteeName}さんにフレンド申請を送信しますか？`}
        confirmText="申請する"
        cancelText="キャンセル"
        onConfirm={handleConfirmRequest}
        onCancel={handleCancelRequest}
        loading={sendingRequest}
      />
    </>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  requestButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});