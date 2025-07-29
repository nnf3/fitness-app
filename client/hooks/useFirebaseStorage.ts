import { useState } from 'react';
import storage from '@react-native-firebase/storage';

export interface UploadResult {
  url: string;
  path: string;
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
}

export const useFirebaseStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const uploadImage = async (
    uri: string,
    path: string,
    metadata?: {
      contentType?: string;
      customMetadata?: { [key: string]: string };
    }
  ): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(null);

    try {
      // ファイルの拡張子を取得
      const extension = uri.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const fileName = `${timestamp}.${extension}`;
      const fullPath = `${path}/${fileName}`;

      // Firebase Storageの参照を作成
      const storageRef = storage().ref(fullPath);

      // メタデータを設定
      const uploadMetadata = {
        contentType: `image/${extension}`,
        ...metadata,
      };

      // アップロードタスクを作成
      const uploadTask = storageRef.putFile(uri, uploadMetadata);

      // アップロードの進行状況を監視
      uploadTask.on('state_changed', (snapshot) => {
        const progress = {
          bytesTransferred: snapshot.bytesTransferred,
          totalBytes: snapshot.totalBytes,
          percentage: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        };
        setUploadProgress(progress);
      });

      // アップロード完了を待機
      await uploadTask;

      // ダウンロードURLを取得
      const downloadURL = await storageRef.getDownloadURL();

      return {
        url: downloadURL,
        path: fullPath,
      };
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error(`Failed to upload image: ${error}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const deleteImage = async (path: string): Promise<void> => {
    try {
      const storageRef = storage().ref(path);
      await storageRef.delete();
    } catch (error) {
      console.error('Image deletion failed:', error);
      throw new Error(`Failed to delete image: ${error}`);
    }
  };

  const getImageURL = async (path: string): Promise<string> => {
    try {
      const storageRef = storage().ref(path);
      return await storageRef.getDownloadURL();
    } catch (error) {
      console.error('Failed to get image URL:', error);
      throw new Error(`Failed to get image URL: ${error}`);
    }
  };

  return {
    uploadImage,
    deleteImage,
    getImageURL,
    isUploading,
    uploadProgress,
  };
};