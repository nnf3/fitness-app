import { ExpoConfig, ConfigContext } from '@expo/config';
import * as dotenv from 'dotenv';
import path from 'path';

// ★ .env.local を明示的に読む（なければ .env）
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') }) || dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "fitness-app",
  slug: "fitness-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon-muscle.png",
  scheme: "com.googleusercontent.apps.fitness-app-prd",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.nnf3.fitness-app",
    googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST ?? './GoogleService-Info.plist',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSPhotoLibraryUsageDescription: "プロフィール写真を選択するためにカメラロールへのアクセスが必要です。",
      NSCameraUsageDescription: "プロフィール写真の撮影とQRコードのスキャンにカメラへのアクセスが必要です。"
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true,
    package: "com.nnf3.fitnessapp",
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    permissions: [
      "android.permission.CAMERA",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE"
    ]
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "@react-native-firebase/crashlytics",
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: process.env.GOOGLE_IOS_REVERSED_CLIENT_ID
      }
    ],
    [
      "react-native-google-mobile-ads", {
        "ios_app_id": process.env.GOOGLE_IOS_APP_ID,
        "android_app_id": process.env.GOOGLE_ANDROID_APP_ID,
        "user_tracking_usage_description": "関連性の高い広告を表示するためにIDをトラッキングいたします。"
      }
    ],
    [
      "expo-build-properties",
      {
        "ios": {
          "useFrameworks": "static"
        }
      }
    ],
    "expo-router",
    "expo-image-picker",
    "expo-camera",
    "expo-tracking-transparency"
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {},
    eas: {
      projectId: "21d4c7ec-1763-4f0d-b0bd-708adbe40897"
    }
  }
})