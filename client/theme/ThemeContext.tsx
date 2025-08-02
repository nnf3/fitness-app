import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, ThemeColors } from './colors';

interface ThemeContextType {
  isDarkMode: boolean;
  theme: ThemeColors;
  toggleTheme: () => void;
  setThemeMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemColorScheme === 'dark');
  const [isManualMode, setIsManualMode] = useState<boolean>(false);

  // システムのカラースキームが変更された時の処理
  useEffect(() => {
    if (!isManualMode) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, isManualMode]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsManualMode(true);
    setIsDarkMode(!isDarkMode);
  };

  const setThemeMode = (isDark: boolean) => {
    setIsManualMode(true);
    setIsDarkMode(isDark);
  };

  const value: ThemeContextType = {
    isDarkMode,
    theme,
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};