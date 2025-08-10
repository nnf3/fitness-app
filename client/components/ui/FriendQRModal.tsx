import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { QRCodeGenerator } from './QRCodeGenerator';
import { QRCodeScanner } from './QRCodeScanner';

interface FriendQRModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  userName?: string;
  onSendFriendRequest: (targetUserId: string) => Promise<void>;
}

export function FriendQRModal({
  visible,
  onClose,
  userId,
  userName,
  onSendFriendRequest,
}: FriendQRModalProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [showScanner, setShowScanner] = useState(false);

  const handleScanSuccess = async (targetUserId: string) => {
    try {
      await onSendFriendRequest(targetUserId);
      Alert.alert('成功', '友達を追加しました！');
      setShowScanner(false); // スキャン画面を閉じる
    } catch (error: any) {
      Alert.alert('エラー', error.message || '友達追加に失敗しました。');
    }
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  return (
    <>
      {/* メインの友達追加モーダル */}
      <Modal
        visible={visible && !showScanner}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome name="times" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>友達追加</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, styles.activeTab]}
                onPress={() => setShowScanner(false)}
              >
                <FontAwesome name="qrcode" size={20} color={theme.primary} />
                <Text style={[styles.tabText, styles.activeTabText]}>QRコード表示</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => setShowScanner(true)}
              >
                <FontAwesome name="camera" size={20} color={theme.textSecondary} />
                <Text style={styles.tabText}>QRコードスキャン</Text>
              </TouchableOpacity>
            </View>

            <QRCodeGenerator
              userId={userId}
              userName={userName}
            />
          </View>
        </View>
      </Modal>

      {/* 独立したQRコードスキャンモーダル */}
      <Modal
        visible={showScanner}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseScanner}
      >
        <QRCodeScanner
          onScanSuccess={handleScanSuccess}
          onClose={handleCloseScanner}
        />
      </Modal>
    </>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: theme.surface,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: theme.background,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
    marginLeft: 8,
  },
  activeTabText: {
    color: theme.primary,
  },
  instructions: {
    margin: 16,
    padding: 16,
    backgroundColor: theme.surface,
    borderRadius: 12,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});
