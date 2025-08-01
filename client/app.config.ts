import { ExpoConfig, ConfigContext } from '@expo/config';

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
    googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST ?? "./GoogleService-Info.plist",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSPhotoLibraryUsageDescription: "プロフィール写真を選択するためにカメラロールへのアクセスが必要です。",
      NSCameraUsageDescription: "プロフィール写真を撮影するためにカメラへのアクセスが必要です。"
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true,
    package: "com.nnf3.fitnessapp",
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
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
        iosUrlScheme: process.env.EXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_ID
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
    "expo-image-picker"
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