import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks';
import { useQuery, useMutation } from '@apollo/client';
import { GetProfileDocument, CreateProfileDocument, UpdateProfileDocument } from '@/documents';
import { GetProfileQuery, CreateProfileMutation, UpdateProfileMutation } from '@/types/graphql';
import { FormField } from './FormField';
import { DateField } from './DateField';
import { ImagePickerComponent } from './ImagePicker';
import { useTheme } from '../../theme';
import { LoadingState, ErrorState } from '../ui';

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    color: theme.textSecondary,
    opacity: 0.8,
  },
  saveButton: {
    backgroundColor: theme.success,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: theme.surfaceVariant,
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
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
  const { data, loading: queryLoading, error: queryError } = useQuery<GetProfileQuery>(GetProfileDocument, {
    skip: !user,
  });

  const [createProfile, { loading: createLoading }] = useMutation<CreateProfileMutation>(CreateProfileDocument, {
    refetchQueries: [{ query: GetProfileDocument }],
    onCompleted: () => {
      Alert.alert('成功', 'プロフィールを作成しました', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    },
    onError: (error) => {
      Alert.alert('エラー', `プロフィールの作成に失敗しました: ${error.message}`);
    },
  });

  const [updateProfile, { loading: updateLoading }] = useMutation<UpdateProfileMutation>(UpdateProfileDocument, {
    refetchQueries: [{ query: GetProfileDocument }],
    onCompleted: () => {
      Alert.alert('成功', 'プロフィールを更新しました', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    },
    onError: (error) => {
      Alert.alert('エラー', `プロフィールの更新に失敗しました: ${error.message}`);
    },
  });

  const hasProfile = !!data?.currentUser?.profile;
  const mutationLoading = createLoading || updateLoading;

  return {
    router,
    user,
    data,
    loading: queryLoading,
    error: queryError,
    createProfile,
    updateProfile,
    hasProfile,
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
    updateProfile,
    hasProfile,
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

  const { theme } = useTheme();
  const styles = createStyles(theme);

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

    const input = {
      name: formData.name.trim(),
      birthDate: formData.birthDate,
      gender: formData.gender,
      height: parseFloat(formData.height) || undefined,
      weight: parseFloat(formData.weight) || undefined,
      activityLevel: formData.activityLevel || undefined,
      imageURL: formData.imageURL || undefined,
    };

    if (hasProfile) {
      // プロフィールが存在する場合は更新
      updateProfile({
        variables: { input },
      });
    } else {
      // プロフィールが存在しない場合は作成
      createProfile({
        variables: { input },
      });
    }
  };

  if (!user) {
    router.replace('/login');
    return null;
  }

  if (queryLoading) {
    return (
      <LoadingState title="読み込み中..." />
    );
  }

  if (queryError) {
    return (
      <ErrorState
        title="エラーが発生しました"
        errorMessage={queryError.message}
      />
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

        <DateField
          label="生年月日"
          value={formData.birthDate}
          onChange={(value) => setFormData({ ...formData, birthDate: value })}
          placeholder="YYYY-MM-DD"
          required
          returnType="string"
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
            {mutationLoading
              ? (hasProfile ? '更新中...' : '作成中...')
              : (hasProfile ? '更新' : '作成')
            }
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}