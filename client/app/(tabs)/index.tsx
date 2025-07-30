import { Text, View, Button, StyleSheet } from "react-native";
import { useAuth } from "../../hooks";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { CurrentUserDocument } from "@/documents";
import { CurrentUserQuery } from "@/graphql/graphql";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: '#1B4332',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  userInfo: {
    backgroundColor: '#2D5A3D',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
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
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  userDetails: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 20,
    opacity: 0.8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FF6B6B',
    marginBottom: 20,
  },
});

export default function HomeTab() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const { data, loading, error } = useQuery<CurrentUserQuery>(CurrentUserDocument, {
    skip: !user, // ユーザーがログインしていない場合はスキップ
  });

  // ログアウト時にログイン画面に遷移
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!user || !data?.currentUser) {
    return null; // ログイン画面に遷移中
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness App</Text>
      <Text style={styles.subtitle}>ようこそ！</Text>

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

      <View style={styles.buttonContainer}>
        <Button title="ログアウト" onPress={handleSignOut} />
      </View>
    </View>
  );
}