import { Text, View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useAuth } from "../../hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { CurrentUserDocument } from "@/documents";
import { CurrentUserQuery } from "@/types/graphql";
import { useTheme } from "../../theme";
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
});

export function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, refetch } = useQuery<CurrentUserQuery>(CurrentUserDocument, {
    skip: !user, // ユーザーがログインしていない場合はスキップ
  });

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
      await refetch();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (!user || !data?.currentUser) {
    return null; // ログイン画面に遷移中
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
      {/* クイックアクションセクション */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.quickActionsTitle}>クイックアクション</Text>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => router.push("/(tabs)/workout")}
        >
          <FontAwesome name="user" size={16} color={theme.text} />
          <Text style={styles.quickActionButtonText}>個人トレを開始</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => router.push("/(tabs)/group-workout")}
        >
          <FontAwesome name="users" size={16} color={theme.text} />
          <Text style={styles.quickActionButtonText}>合トレに参加</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => router.push("/(tabs)/friends")}
        >
          <FontAwesome name="user-plus" size={16} color={theme.text} />
          <Text style={styles.quickActionButtonText}>フレンドを追加</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}