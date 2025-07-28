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
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks';
import { useQuery, useMutation, gql } from '@apollo/client';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';

const CURRENT_USER_QUERY = gql`
  query ProfileEditCurrentUser {
    currentUser {
      id
      uid
      profile {
        id
        name
        birthDate
        gender
        height
        weight
        activityLevel
        imageURL
      }
    }
  }
`;

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfile!) {
    updateProfile(input: $input) {
      id
      name
      birthDate
      gender
      height
      weight
      activityLevel
      imageURL
    }
  }
`;

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
    paddingBottom: 40,
    flex: 1,
    justifyContent: 'center',
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
  },
  picker: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
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
});

export default function ProfileEditScreen() {
  const router = useRouter();
  const { user } = useAuth();
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

  const { data, loading: queryLoading, error: queryError } = useQuery(CURRENT_USER_QUERY, {
    skip: !user,
  });

  const [createProfile, { loading: mutationLoading }] = useMutation(UPDATE_PROFILE_MUTATION, {
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
      // ここでは一時的にローカルURIを設定（本来はFirebase Storageにアップロード）
      setFormData({ ...formData, imageURL: imageUri });
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Fitness App</Text>
        <Text style={styles.subtitle}>プロフィールを編集</Text>

        {/* 画像選択セクション */}
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.profileImage} />
            ) : (
              <Text style={styles.imagePlaceholder}>📷</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>
              {selectedImage ? '写真を変更' : '写真を選択'}
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
                { label: '男性', value: 'male' },
                { label: '女性', value: 'female' },
                { label: 'その他', value: 'other' },
              ]}
              placeholder={{
                label: '性別を選択',
                value: '',
              }}
              value={formData.gender}
              style={{
                inputIOS: styles.picker,
                inputAndroid: styles.picker,
                placeholder: {
                  color: '#FFFFFF',
                  opacity: 0.6,
                },
              }}
              onValueChange={(value: string) => setFormData({ ...formData, gender: value })}
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
                { label: '低い（座り仕事中心）', value: 'sedentary' },
                { label: '軽い（軽い運動）', value: 'lightly_active' },
                { label: '普通（適度な運動）', value: 'moderately_active' },
                { label: '高い（激しい運動）', value: 'very_active' },
                { label: '非常に高い（非常に激しい運動）', value: 'extremely_active' },
              ]}
              placeholder={{
                label: '活動レベルを選択',
                value: '',
              }}
              value={formData.activityLevel}
              style={{
                inputIOS: styles.picker,
                inputAndroid: styles.picker,
                placeholder: {
                  color: '#FFFFFF',
                  opacity: 0.6,
                },
              }}
              onValueChange={(value: string) => setFormData({ ...formData, activityLevel: value })}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (!isFormValid || mutationLoading) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!isFormValid || mutationLoading}
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