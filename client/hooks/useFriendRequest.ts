import { useMutation } from '@apollo/client';
import { SendFriendshipRequestDocument, AddFriendByQRCodeDocument } from '../documents';
import {
  SendFriendshipRequestMutation,
  SendFriendshipRequestMutationVariables,
  AddFriendByQrCodeMutation,
  AddFriendByQrCodeMutationVariables,
} from '../types/graphql';

export function useFriendRequest() {
  const [sendFriendRequest, { loading: sendRequestLoading }] = useMutation<
    SendFriendshipRequestMutation,
    SendFriendshipRequestMutationVariables
  >(SendFriendshipRequestDocument);

  const [addFriendByQRCode, { loading: addFriendLoading }] = useMutation<
    AddFriendByQrCodeMutation,
    AddFriendByQrCodeMutationVariables
  >(AddFriendByQRCodeDocument);

  const sendRequest = async (targetUserId: string): Promise<void> => {
    try {
      const result = await sendFriendRequest({
        variables: {
          input: {
            requesteeID: targetUserId,
          },
        },
      });

      if (result.data?.sendFriendshipRequest) {
        console.log('Friend request sent successfully');
      }
    } catch (error: any) {
      // エラーメッセージの詳細化
      if (error.message.includes('already exists')) {
        throw new Error('既に友達リクエストが送信されているか、既に友達です。');
      } else if (error.message.includes('not found')) {
        throw new Error('指定されたユーザーが見つかりません。');
      } else if (error.message.includes('unauthorized')) {
        throw new Error('認証に失敗しました。再度ログインしてください。');
      } else {
        throw new Error('友達リクエストの送信に失敗しました。');
      }
    }
  };

  const addFriendByQR = async (targetUserId: string): Promise<void> => {
    try {
      const result = await addFriendByQRCode({
        variables: {
          input: {
            targetUserID: targetUserId,
          },
        },
      });

      if (result.data?.addFriendByQRCode) {
        console.log('Friend added successfully by QR code');
      }
    } catch (error: any) {
      // エラーメッセージの詳細化
      if (error.message.includes('already friends')) {
        throw new Error('既に友達です。');
      } else if (error.message.includes('cannot add yourself')) {
        throw new Error('自分自身を友達に追加することはできません。');
      } else if (error.message.includes('not found')) {
        throw new Error('指定されたユーザーが見つかりません。');
      } else if (error.message.includes('unauthorized')) {
        throw new Error('認証に失敗しました。再度ログインしてください。');
      } else {
        throw new Error('友達追加に失敗しました。');
      }
    }
  };

  return {
    sendRequest,
    addFriendByQR,
    loading: sendRequestLoading || addFriendLoading,
  };
}
