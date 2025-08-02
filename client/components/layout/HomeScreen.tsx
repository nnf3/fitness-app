import { Text, View, Button, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../../hooks";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { CurrentUserDocument } from "@/documents";
import { CurrentUserQuery } from "@/types/graphql";
import { useTheme } from "../../theme";
import { FriendshipRequestButton } from "@/components/ui";

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: theme.text,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: theme.textSecondary,
    opacity: 0.8,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  userInfo: {
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
  userEmail: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  userDetails: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.textSecondary,
    marginBottom: 20,
    opacity: 0.8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.error,
    marginBottom: 20,
  },
  friendSection: {
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
  friendSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  friendSectionSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  friendRequestButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendRequestButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickActionsSection: {
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
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  quickActionButton: {
    backgroundColor: theme.surfaceVariant,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionButtonText: {
    color: theme.text,
    fontSize: 14,
    marginLeft: 8,
  },
  recommendedSection: {
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
  recommendedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: theme.surfaceVariant,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primaryVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  const { data, loading, error } = useQuery<CurrentUserQuery>(CurrentUserDocument, {
    skip: !user, // ユーザーがログインしていない場合はスキップ
  });

  const styles = createStyles(theme);

  // ログアウト時にログイン画面に遷移
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user || !data?.currentUser) {
    return null; // ログイン画面に遷移中
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.subtitle}>ようこそ！</Text>

      {/* ユーザー情報セクション */}
      <View style={styles.userInfo}>
        <Text style={styles.userEmail}>{user.email}</Text>

        {loading && (
          <Text style={styles.loadingText}>ユーザー情報を取得中...</Text>
        )}

        {error && (
          <Text style={styles.errorText}>
            ユーザー情報の取得に失敗しました: {error.message}
          </Text>
        )}

        {data?.currentUser && (
          <>
            <Text style={styles.userDetails}>
              ユーザーID: {data.currentUser.id}
            </Text>
            <Text style={styles.userDetails}>
              作成日: {new Date(data.currentUser.createdAt).toLocaleDateString('ja-JP')}
            </Text>
            {data.currentUser.profile && (
              <>
                <Text style={styles.userName}>{data.currentUser.profile.name}</Text>
                <Text style={styles.userDetails}>
                  身長: {data.currentUser.profile.height}cm
                </Text>
                <Text style={styles.userDetails}>
                  体重: {data.currentUser.profile.weight}kg
                </Text>
                <Text style={styles.userDetails}>
                  性別: {data.currentUser.profile?.gender === 'MALE' ? '男性' :
                         data.currentUser.profile?.gender === 'FEMALE' ? '女性' : 'その他'}
                </Text>
              </>
            )}
          </>
        )}
      </View>

      {/* おすすめユーザーセクション */}
      {data?.currentUser?.recommendedUsers && data.currentUser.recommendedUsers.length > 0 && (
        <View style={styles.recommendedSection}>
          <Text style={styles.recommendedTitle}>おすすめユーザー</Text>
          {data.currentUser.recommendedUsers.map((recommendedUser) => (
            <View key={recommendedUser.id} style={styles.userCard}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {recommendedUser.profile?.name?.charAt(0) || 'U'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>
                  {recommendedUser.profile?.name || '名前未設定'}
                </Text>
                <Text style={styles.userDetails}>
                  {recommendedUser.profile?.gender === 'MALE' ? '男性' :
                   recommendedUser.profile?.gender === 'FEMALE' ? '女性' : 'その他'}
                  {recommendedUser.profile?.height && ` • ${recommendedUser.profile.height}cm`}
                  {recommendedUser.profile?.weight && ` • ${recommendedUser.profile.weight}kg`}
                </Text>
              </View>
              <FriendshipRequestButton
                requesteeId={recommendedUser.id}
                requesteeName={recommendedUser.profile?.name || '名前未設定'}
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}