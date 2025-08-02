export interface ThemeColors {
  // 背景色
  background: string;
  surface: string;
  surfaceVariant: string;

  // テキスト色
  text: string;
  textSecondary: string;
  textTertiary: string;

  // アクセント色
  primary: string;
  primaryVariant: string;
  secondary: string;

  // 状態色
  success: string;
  warning: string;
  error: string;

  // 境界線・区切り線
  border: string;
  divider: string;

  // その他
  overlay: string;
  shadow: string;
}

export const lightTheme: ThemeColors = {
  // 背景色
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceVariant: '#E9ECEF',

  // テキスト色
  text: '#212529',
  textSecondary: '#6C757D',
  textTertiary: '#ADB5BD',

  // アクセント色
  primary: '#1B4332',
  primaryVariant: '#2D5A3D',
  secondary: '#007AFF',

  // 状態色
  success: '#28A745',
  warning: '#FFC107',
  error: '#FF6B6B',

  // 境界線・区切り線
  border: '#DEE2E6',
  divider: '#E9ECEF',

  // その他
  overlay: 'rgba(0, 0, 0, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme: ThemeColors = {
  // 背景色
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2D2D2D',

  // テキスト色
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',

  // アクセント色
  primary: '#4CAF50',
  primaryVariant: '#66BB6A',
  secondary: '#2196F3',

  // 状態色
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',

  // 境界線・区切り線
  border: '#404040',
  divider: '#2D2D2D',

  // その他
  overlay: 'rgba(255, 255, 255, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.3)',
};