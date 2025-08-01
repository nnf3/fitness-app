import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks';
import { useQuery, useMutation } from '@apollo/client';
import { ProfileEditCurrentUserDocument, UpdateProfileDocument } from '@/documents';
import { ProfileEditCurrentUserQuery, UpdateProfileMutation } from '@/types/graphql';
import { FormField } from './FormField';
import { ImagePickerComponent } from './ImagePicker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B4332',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 100,
    flexGrow: 1,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B4332',
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

interface FormData {
  name: string;
  birthDate: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  imageURL: string;
}

const genderOptions = [
  { label: '男性', value: 'MALE' },
  { label: '女性', value: 'FEMALE' },
  { label: 'その他', value: 'OTHER' },
];

const activityLevelOptions = [
  { label: '座り仕事中心', value: 'SEDENTARY' },
  { label: '軽い運動', value: 'LIGHTLY_ACTIVE' },
  { label: '適度な運動', value: 'MODERATELY_ACTIVE' },
  { label: '活発な運動', value: 'VERY_ACTIVE' },
  { label: '非常に活発な運動', value: 'EXTREMELY_ACTIVE' },
];

const useProfileEditQuery = () => {
  const router = useRouter();
  const { user } = useAuth();
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

  return {
    router,
    user,
    data,
    loading: queryLoading,
    error: queryError,
    createProfile,
    mutationLoading,
  };
}

const useProfileEditForm = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ percentage: number } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    birthDate: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    imageURL: '',
  });

  const handleImageSelect = (imageUrl: string) => {
    setFormData({ ...formData, imageURL: imageUrl });
    setSelectedImage(imageUrl);
  };

  return {
    selectedImage,
    setSelectedImage,
    isUploading,
    uploadProgress,
    setUploadProgress,
    setIsUploading,
    formData,
    setFormData,
    handleImageSelect,
  }
}

export const ProfileEditForm = () => {
  const {
    router,
    user,
    data,
    loading: queryLoading,
    error: queryError,
    createProfile,
    mutationLoading,
  } = useProfileEditQuery();

  const {
    selectedImage,
    setSelectedImage,
    isUploading,
    uploadProgress,
    formData,
    setFormData,
    handleImageSelect,
  } = useProfileEditForm();

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
      if (profile.imageURL) {
        setSelectedImage(profile.imageURL);
      }
    }
  }, [data, setFormData, setSelectedImage]);

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

        <ImagePickerComponent
          selectedImage={selectedImage}
          onImageSelect={handleImageSelect}
          userId={user?.uid}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />

        <FormField
          label="名前"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="名前を入力"
          required
        />

        <FormField
          label="生年月日"
          value={formData.birthDate}
          onChangeText={(text) => setFormData({ ...formData, birthDate: text })}
          placeholder="YYYY-MM-DD"
          required
        />

        <FormField
          label="性別"
          value={formData.gender}
          onChangeText={(text) => setFormData({ ...formData, gender: text })}
          type="picker"
          pickerOptions={genderOptions}
          required
        />

        <FormField
          label="身長"
          value={formData.height}
          onChangeText={(text) => setFormData({ ...formData, height: text })}
          placeholder="身長を入力 (cm)"
          type="number"
          required
        />

        <FormField
          label="体重"
          value={formData.weight}
          onChangeText={(text) => setFormData({ ...formData, weight: text })}
          placeholder="体重を入力 (kg)"
          type="number"
          required
        />

        <FormField
          label="活動レベル"
          value={formData.activityLevel}
          onChangeText={(text) => setFormData({ ...formData, activityLevel: text })}
          type="picker"
          pickerOptions={activityLevelOptions}
        />

        <TouchableOpacity
          style={[styles.saveButton, (!isFormValid || mutationLoading) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isFormValid || mutationLoading}
        >
          <Text style={styles.saveButtonText}>
            {mutationLoading ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}