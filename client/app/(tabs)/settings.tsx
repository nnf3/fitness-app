import { Text, View, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../hooks";
import { useRouter } from "expo-router";
import { useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B4332',
  },
  section: {
    backgroundColor: '#2D5A3D',
    marginVertical: 8,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  settingValue: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  userInfo: {
    padding: 16,
    backgroundColor: '#2D5A3D',
    marginVertical: 8,
    marginHorizontal: 16,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 12,
  },
  userEmail: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
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

export default function SettingsTab() {
  const { user, signOut } = useAuth();
  const router = useRouter();
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
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('/profile-edit')}
        >
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