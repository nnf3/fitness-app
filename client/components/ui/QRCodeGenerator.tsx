import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../../theme';

interface QRCodeGeneratorProps {
  userId: string;
  userName?: string;
}

export function QRCodeGenerator({ userId, userName }: QRCodeGeneratorProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // QRコードに含めるデータ（ユーザーIDとアプリのスキーム）
  const qrData = `fitnessapp://friend/${userId}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>友達追加用QRコード</Text>
      <Text style={styles.subtitle}>
        {userName ? `${userName}さんのQRコード` : 'あなたのQRコード'}
      </Text>

      <View style={styles.qrContainer}>
        <QRCode
          value={qrData}
          size={200}
          color={theme.text}
          backgroundColor={theme.background}
        />
      </View>

      <Text style={styles.instruction}>
        友達にこのQRコードを見せて、友達追加してもらいましょう
      </Text>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.surface,
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 20,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: theme.background,
    borderRadius: 8,
    marginBottom: 16,
  },
  instruction: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
});
