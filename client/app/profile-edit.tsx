import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useAuth, useFirebaseStorage } from '../hooks';
import { useQuery, useMutation } from '@apollo/client';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import { ProfileEditCurrentUserDocument, UpdateProfileDocument } from '@/documents';
import { ProfileEditCurrentUserQuery, UpdateProfileMutation } from '@/graphql/graphql';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B4332', // ダークグリーン背景
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 100, // 下部のパディングを増やして保存ボタンが見切れないようにする
    flexGrow: 1, // flex: 1をflexGrow: 1に変更
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2D5A3D', // より明るいグリーン
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 50,
  },
  pickerContainer: {
    backgroundColor: '#2D5A3D',
    borderWidth: 0,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 50,
    justifyContent: 'center',
  },
  picker: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20, // 下部マージンを追加
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: '#2D5A3D',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 画像選択関連のスタイル
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2D5A3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
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
  imageButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // アップロード関連のスタイル
  imageContainerDisabled: {
    opacity: 0.6,
  },
  imageButtonDisabled: {
    backgroundColor: '#2D5A3D',
    opacity: 0.6,
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default function ProfileEditScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { uploadImage, isUploading, uploadProgress } = useFirebaseStorage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    imageURL: '',
  });

  const { data, loading: queryLoading, error: queryError } = useQuery<ProfileEditCurrentUserQuery>(ProfileEditCurrentUserDocument, {
    skip: !user,
  });

  const [createProfile, { loading: mutationLoading }] = useMutation<UpdateProfileMutation>(UpdateProfileDocument, {
    onCompleted: () => {
      Alert.alert('成功', 'プロフィールを保存しました', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    },
    onError: (error) => {
      Alert.alert('エラー', `プロフィールの保存に失敗しました: ${error.message}`);
    },
  });

  useEffect(() => {
    if (data?.currentUser?.profile) {
      const profile = data.currentUser.profile;
      setFormData({
        name: profile.name || '',
        birthDate: profile.birthDate || '',
        gender: profile.gender || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        activityLevel: profile.activityLevel || '',
        imageURL: profile.imageURL || '',
      });
      // 既存の画像URLがあれば選択状態にする
      if (profile.imageURL) {
        setSelectedImage(profile.imageURL);
      }
    }
  }, [data]);

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
      setSelectedImage(imageUri);

      try {
        // Firebase Storageにアップロード
        const uploadResult = await uploadImage(
          imageUri,
          `users/${user?.uid}/profile-images`,
          {
            customMetadata: {
              uploadedAt: new Date().toISOString(),
              userId: user?.uid || '',
            },
          }
        );

        // アップロード成功後、URLをフォームデータに設定
        setFormData({ ...formData, imageURL: uploadResult.url });
        Alert.alert('成功', '画像をアップロードしました');
      } catch (error) {
        console.error('Image upload failed:', error);
        Alert.alert('エラー', '画像のアップロードに失敗しました');
        setSelectedImage(null);
      }
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('エラー', '名前を入力してください');
      return;
    }

    if (!formData.birthDate) {
      Alert.alert('エラー', '生年月日を選択してください');
      return;
    }

    if (!formData.gender) {
      Alert.alert('エラー', '性別を選択してください');
      return;
    }

    if (!formData.height || !formData.weight) {
      Alert.alert('エラー', '身長と体重を入力してください');
      return;
    }

    createProfile({
      variables: {
        input: {
          name: formData.name.trim(),
          birthDate: formData.birthDate,
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          activityLevel: formData.activityLevel || undefined,
          imageURL: formData.imageURL || undefined,
        },
      },
    });
  };

  if (!user) {
    router.replace('/login');
    return null;
  }

  if (queryLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 16, color: '#666' }}>読み込み中...</Text>
        </View>
      </View>
    );
  }

  if (queryError) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            エラーが発生しました: {queryError.message}
          </Text>
        </View>
      </View>
    );
  }

  const isFormValid = formData.name.trim() && formData.birthDate && formData.gender && formData.height && formData.weight;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitle}>プロフィールを編集</Text>

        {/* 画像選択セクション */}
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

        <View style={styles.formGroup}>
          <Text style={styles.label}>名前 *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="名前を入力"
            placeholderTextColor="#FFFFFF"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>生年月日 *</Text>
          <TextInput
            style={styles.input}
            value={formData.birthDate}
            onChangeText={(text) => setFormData({ ...formData, birthDate: text })}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#FFFFFF"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>性別 *</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              items={[
                { label: '性別を選択', value: '' },
                { label: '男性', value: 'MALE' },
                { label: '女性', value: 'FEMALE' },
                { label: 'その他', value: 'OTHER' },
              ]}
              placeholder={{
                label: '性別を選択',
                value: '',
              }}
              value={formData.gender}
              style={{
                inputIOS: styles.picker,
                inputIOSContainer: {
                  pointerEvents: 'none',
                },
                inputAndroid: styles.picker,
                inputAndroidContainer: {
                  pointerEvents: 'none',
                },
                placeholder: {
                  color: '#FFFFFF',
                  opacity: 0.6,
                },
                iconContainer: {
                  top: 16,
                  right: 12,
                },
              }}
              onValueChange={(value: string) => setFormData({ ...formData, gender: value })}
              Icon={() => <Ionicons name="chevron-down" size={20} color="#FFFFFF" />}
              useNativeAndroidPickerStyle={false}
              fixAndroidTouchableBug={true}
              pickerProps={{
                itemStyle: { color: '#000000' },
              }}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>身長 (cm) *</Text>
          <TextInput
            style={styles.input}
            value={formData.height}
            onChangeText={(text) => setFormData({ ...formData, height: text })}
            placeholder="身長を入力"
            placeholderTextColor="#FFFFFF"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>体重 (kg) *</Text>
          <TextInput
            style={styles.input}
            value={formData.weight}
            onChangeText={(text) => setFormData({ ...formData, weight: text })}
            placeholder="体重を入力"
            placeholderTextColor="#FFFFFF"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>活動レベル</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              items={[
                { label: '活動レベルを選択', value: '' },
                { label: '低い（座り仕事中心）', value: 'SEDENTARY' },
                { label: '軽い（軽い運動）', value: 'LIGHTLY_ACTIVE' },
                { label: '普通（適度な運動）', value: 'MODERATELY_ACTIVE' },
                { label: '高い（激しい運動）', value: 'VERY_ACTIVE' },
                { label: '非常に高い（非常に激しい運動）', value: 'EXTREMELY_ACTIVE' },
              ]}
              placeholder={{
                label: '活動レベルを選択',
                value: '',
              }}
              value={formData.activityLevel}
              style={{
                inputIOS: styles.picker,
                inputIOSContainer: {
                  pointerEvents: 'none',
                },
                inputAndroid: styles.picker,
                inputAndroidContainer: {
                  pointerEvents: 'none',
                },
                placeholder: {
                  color: '#FFFFFF',
                  opacity: 0.6,
                },
                iconContainer: {
                  top: 16,
                  right: 12,
                },
              }}
              onValueChange={(value: string) => setFormData({ ...formData, activityLevel: value })}
              Icon={() => <Ionicons name="chevron-down" size={20} color="#FFFFFF" />}
              useNativeAndroidPickerStyle={false}
              fixAndroidTouchableBug={true}
              pickerProps={{
                itemStyle: { color: '#000000' },
              }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (!isFormValid || mutationLoading || isUploading) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!isFormValid || mutationLoading || isUploading}
        >
          {mutationLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>プロフィールを保存</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}