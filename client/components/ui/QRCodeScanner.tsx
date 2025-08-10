import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '../../theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface QRCodeScannerProps {
  onScanSuccess: (userId: string) => void;
  onClose: () => void;
}

export function QRCodeScanner({ onScanSuccess, onClose }: QRCodeScannerProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarcodeScanned = (result: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);

    // QRコードのデータ形式をチェック: fitnessapp://friend/{userId}
    const match = result.data.match(/^fitnessapp:\/\/friend\/(.+)$/);
    if (match) {
      const userId = match[1];
      Alert.alert(
        '友達追加',
        'このユーザーを友達に追加しますか？',
        [
          {
            text: 'キャンセル',
            style: 'cancel',
            onPress: () => setScanned(false),
          },
          {
            text: '追加',
            onPress: () => {
              onScanSuccess(userId);
              onClose();
            },
          },
        ]
      );
    } else {
      Alert.alert('エラー', '無効なQRコードです。正しい友達追加用QRコードをスキャンしてください。', [
        {
          text: 'OK',
          onPress: () => setScanned(false),
        },
      ]);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.permissionText}>カメラの許可を確認中...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <FontAwesome name="camera" size={64} color={theme.error} />
        <Text style={styles.permissionText}>カメラへのアクセスが許可されていません</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={onClose}>
          <Text style={styles.permissionButtonText}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome name="times" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QRコードをスキャン</Text>
        <View style={styles.placeholder} />
      </View>

      <CameraView
        style={styles.scanner}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      >
        <View style={styles.overlay}>
          {/* 上部の暗いオーバーレイ */}
          <View style={styles.topOverlay} />

          {/* 中央のスキャンエリア */}
          <View style={styles.scanArea}>
            {/* 左側の暗いオーバーレイ */}
            <View style={styles.sideOverlay} />

            {/* スキャンフレーム */}
            <View style={styles.scanFrame}>
              {/* コーナーインジケーター */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            {/* 右側の暗いオーバーレイ */}
            <View style={styles.sideOverlay} />
          </View>

          {/* 下部の暗いオーバーレイ */}
          <View style={styles.bottomOverlay}>
            <Text style={styles.scanText}>
              QRコードを枠内に合わせてください
            </Text>
          </View>
        </View>
      </CameraView>

      {scanned && (
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => setScanned(false)}
        >
          <FontAwesome name="refresh" size={16} color={theme.background} />
          <Text style={styles.rescanButtonText}>再スキャン</Text>
        </TouchableOpacity>
      )}
    </View>
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
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: theme.background,
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
  scanner: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topOverlay: {
    height: '25%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanArea: {
    flexDirection: 'row',
    height: '50%',
    alignItems: 'center',
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanFrame: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: theme.primary,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rescanButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rescanButtonText: {
    color: theme.background,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  permissionText: {
    fontSize: 16,
    color: theme.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: theme.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
