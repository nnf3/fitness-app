import { Alert } from 'react-native';

export function useFriendshipActions() {
  const handleAcceptRequest = (requestId: string, acceptRequest: (variables: any) => Promise<any>) => {
    Alert.alert(
      'フレンドリクエスト承認',
      'このリクエストを承認しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '承認',
          onPress: async () => {
            try {
              await acceptRequest({
                variables: {
                  input: {
                    friendshipID: requestId
                  }
                }
              });
              Alert.alert('成功', 'フレンドリクエストを承認しました');
            } catch (error: any) {
              Alert.alert('エラー', `リクエストの承認に失敗しました: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const handleRejectRequest = (requestId: string, rejectRequest: (variables: any) => Promise<any>) => {
    Alert.alert(
      'フレンドリクエスト拒否',
      'このリクエストを拒否しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '拒否',
          style: 'destructive',
          onPress: async () => {
            try {
              await rejectRequest({
                variables: {
                  input: {
                    friendshipID: requestId
                  }
                }
              });
              Alert.alert('成功', 'フレンドリクエストを拒否しました');
            } catch (error: any) {
              Alert.alert('エラー', `リクエストの拒否に失敗しました: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  return {
    handleAcceptRequest,
    handleRejectRequest,
  };
}
