import { Text, View, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../hooks";
import { useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  settingValue: {
    fontSize: 16,
    color: '#8E8E93',
  },
  userInfo: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  userEmail: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
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

export default function SettingsTab() {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

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
      {/* ユーザー情報セクション */}
      <View style={styles.userInfo}>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* 通知設定セクション */}
      <Text style={styles.sectionHeader}>通知</Text>
      <View style={styles.section}>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>プッシュ通知</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
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
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
            thumbColor={darkModeEnabled ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>プライバシーポリシー</Text>
          <FontAwesome name="chevron-right" size={16} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
          <Text style={styles.settingText}>利用規約</Text>
          <FontAwesome name="chevron-right" size={16} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* アカウントセクション */}
      <Text style={styles.sectionHeader}>アカウント</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>プロフィール編集</Text>
          <FontAwesome name="chevron-right" size={16} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
          <Text style={styles.settingText}>パスワード変更</Text>
          <FontAwesome name="chevron-right" size={16} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* ログアウトボタン */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>ログアウト</Text>
      </TouchableOpacity>
    </View>
  );
}