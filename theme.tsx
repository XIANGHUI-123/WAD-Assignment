import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppThemeMode = 'light' | 'dark';

export type AppTheme = {
  mode: AppThemeMode;
  colors: {
    background: string;
    surface: string;
    card: string;
    text: string;
    mutedText: string;
    border: string;
    primary: string;
    secondaryBackground: string;
    successBackground: string;
  };
};

type ThemeContextValue = {
  theme: AppTheme;
  mode: AppThemeMode;
  isDarkMode: boolean;
  toggleDarkMode: (enabled: boolean) => void;
  isThemeReady: boolean;
};

const THEME_STORAGE_KEY = '@app_theme_mode';

const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1E293B',
    mutedText: '#64748B',
    border: '#E2E8F0',
    primary: '#4F46E5',
    secondaryBackground: '#EEF2FF',
    successBackground: '#ECFDF5',
  },
};

const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    background: '#0F172A',
    surface: '#111827',
    card: '#b0bcd0',
    text: '#E2E8F0',
    mutedText: '#94A3B8',
    border: '#334155',
    primary: '#818CF8',
    secondaryBackground: '#1E1B4B',
    successBackground: '#052e16',
  },
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const [mode, setMode] = useState<AppThemeMode>('light');
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedMode === 'dark' || storedMode === 'light') {
          setMode(storedMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsThemeReady(true);
      }
    };

    loadTheme();
  }, []);

  const toggleDarkMode = async (enabled: boolean) => {
    const nextMode: AppThemeMode = enabled ? 'dark' : 'light';
    setMode(nextMode);

    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const value = useMemo(
    () => ({
      theme: mode === 'dark' ? darkTheme : lightTheme,
      mode,
      isDarkMode: mode === 'dark',
      toggleDarkMode,
      isThemeReady,
    }),
    [isThemeReady, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }

  return context;
};
