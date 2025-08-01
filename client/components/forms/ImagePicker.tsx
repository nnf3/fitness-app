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

interface ImagePickerProps {
  selectedImage: string | null;
  onImageSelect: (imageUrl: string) => void;
  userId: string | undefined;
  isUploading: boolean;
  uploadProgress: { percentage: number } | null;
}

const styles = StyleSheet.create({
  imageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2D5A3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainerDisabled: {
    opacity: 0.6,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    fontSize: 48,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  imageButtonDisabled: {
    backgroundColor: '#2D5A3D',
    opacity: 0.6,
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export function ImagePickerComponent({
  selectedImage,
  onImageSelect,
  userId,
  isUploading,
  uploadProgress,
}: ImagePickerProps) {
  const { uploadImage } = useFirebaseStorage();

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
          `users/${userId}/profile-images`,
          {
            customMetadata: {
              uploadedAt: new Date().toISOString(),
              userId: userId || '',
            },
          }
        );

        // アップロード成功後、URLをフォームデータに設定
        onImageSelect(uploadResult.url);
        Alert.alert('成功', '画像をアップロードしました');
      } catch (error) {
        console.error('Image upload failed:', error);
        Alert.alert('エラー', '画像のアップロードに失敗しました');
      }
    }
  };

  return (
    <View style={styles.imageSection}>
      <TouchableOpacity
        style={[styles.imageContainer, isUploading && styles.imageContainerDisabled]}
        onPress={pickImage}
        disabled={isUploading}
      >
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.profileImage} />
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
          {isUploading ? 'アップロード中...' : (selectedImage ? '写真を変更' : '写真を選択')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}