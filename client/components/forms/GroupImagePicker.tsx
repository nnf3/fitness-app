import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFirebaseStorage } from '../../hooks';
import { useTheme } from '../../theme';

interface GroupImagePickerProps {
  selectedImage: string | null;
  onImageSelect: (imageUrl: string) => void;
  userId: string | undefined;
  isUploading: boolean;
  uploadProgress: { percentage: number } | null;
}

const createStyles = (theme: any) => StyleSheet.create({
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: theme.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.border,
    borderStyle: 'dashed',
  },
  imageContainerDisabled: {
    opacity: 0.6,
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  imagePlaceholder: {
    fontSize: 32,
    color: theme.textSecondary,
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 4,
  },
  imageButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  imageButtonDisabled: {
    backgroundColor: theme.textSecondary,
    opacity: 0.6,
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export function GroupImagePicker({
  selectedImage,
  onImageSelect,
  userId,
  isUploading,
  uploadProgress,
}: GroupImagePickerProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { uploadImage } = useFirebaseStorage();

  const handleImageSelect = async (imageUrl: string) => {
    onImageSelect(imageUrl);
  };

  const pickImage = async () => {
    // カメラロールへのアクセス許可をリクエスト
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('権限が必要です', '写真を選択するにはカメラロールへのアクセス許可が必要です。');
      return;
    }

    // 画像選択を実行
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      try {
        // Firebase Storageにアップロード
        const uploadResult = await uploadImage(
          imageUri,
          `groups/${userId}/group-images`,
          {
            customMetadata: {
              uploadedAt: new Date().toISOString(),
              userId: userId || '',
            },
          }
        );

        // アップロード成功後、URLをフォームデータに設定
        handleImageSelect(uploadResult.url);
        Alert.alert('成功', '画像をアップロードしました');
      } catch (error) {
        console.error('Image upload failed:', error);
        Alert.alert('エラー', '画像のアップロードに失敗しました');
      }
    }
  };

  return (
    <View style={styles.imageSection}>
      <Text style={styles.label}>グループ画像</Text>
      <TouchableOpacity
        style={[styles.imageContainer, isUploading && styles.imageContainerDisabled]}
        onPress={pickImage}
        disabled={isUploading}
      >
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.groupImage} />
        ) : (
          <Text style={styles.imagePlaceholder}>📷</Text>
        )}
        {isUploading && (
          <View style={styles.uploadOverlay}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.uploadText}>
              {uploadProgress ? `${Math.round(uploadProgress.percentage)}%` : 'アップロード中...'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.imageButton, isUploading && styles.imageButtonDisabled]}
        onPress={pickImage}
        disabled={isUploading}
      >
        <Text style={styles.imageButtonText}>
          {isUploading ? 'アップロード中...' : (selectedImage ? '画像を変更' : '画像を選択')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
