import { Text, View, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../hooks";
import { useRouter } from "expo-router";
import { useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from "../../theme";

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  section: {
    backgroundColor: theme.surface,
    marginVertical: 8,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textSecondary,
    marginHorizontal: 16,
    marginVertical: 8,
    opacity: 0.8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingText: {
    fontSize: 16,
    color: theme.text,
  },
  settingValue: {
    fontSize: 16,
    color: theme.textSecondary,
    opacity: 0.7,
  },
  userInfo: {
    padding: 16,
    backgroundColor: theme.surface,
    marginVertical: 8,
    marginHorizontal: 16,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 12,
  },
  userEmail: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: theme.error,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
  },
});

export function SettingsScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { theme, isDarkMode, setThemeMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const styles = createStyles(theme);

  const handleLogout = () => {
    Alert.alert(
      "ログアウト",
      "ログアウトしますか？",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "ログアウト",
          style: "destructive",
          onPress: signOut,
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Text style={styles.settingText}>ログインしてください</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* 通知設定セクション */}
      <Text style={styles.sectionHeader}>通知</Text>
      <View style={styles.section}>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>プッシュ通知</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: theme.divider, true: theme.secondary }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>

      {/* アプリ設定セクション */}
      <Text style={styles.sectionHeader}>アプリ設定</Text>
      <View style={styles.section}>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>ダークモード</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setThemeMode}
            trackColor={{ false: theme.divider, true: theme.secondary }}
            thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>プライバシーポリシー</Text>
          <FontAwesome name="chevron-right" size={16} color={theme.textTertiary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
          <Text style={styles.settingText}>利用規約</Text>
          <FontAwesome name="chevron-right" size={16} color={theme.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* アカウントセクション */}
      <Text style={styles.sectionHeader}>アカウント</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('/profile-edit')}
        >
          <Text style={styles.settingText}>プロフィール編集</Text>
          <FontAwesome name="chevron-right" size={16} color={theme.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* ログアウトボタン */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>ログアウト</Text>
      </TouchableOpacity>
    </View>
  );
}