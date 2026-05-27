import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export interface Theme {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentDark: string;
  border: string;
  danger: string;
  dangerBg: string;
  dangerBorder: string;
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
  gradientStart: string;
  gradientEnd: string;
  isDark: boolean;
}

const light: Theme = {
  background: '#EAF0F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F8FAFC',
  text: '#1E3A5F',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  accent: '#268EBA',
  accentDark: '#1E6B8F',
  border: '#F1F5F9',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  dangerBorder: '#FEE2E2',
  tabBar: '#FFFFFF',
  tabBarActive: '#1E3A5F',
  tabBarInactive: '#94A3B8',
  gradientStart: '#268EBA',
  gradientEnd: '#1E6B8F',
  isDark: false,
};

const dark: Theme = {
  background: '#0B1121',
  surface: '#1E293B',
  surfaceAlt: '#0F172A',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  accent: '#38BDF8',
  accentDark: '#0EA5E9',
  border: '#334155',
  danger: '#F87171',
  dangerBg: '#451A1A',
  dangerBorder: '#7F1D1D',
  tabBar: '#1E293B',
  tabBarActive: '#38BDF8',
  tabBarInactive: '#64748B',
  gradientStart: '#38BDF8',
  gradientEnd: '#0EA5E9',
  isDark: true,
};

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: light, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  const toggleTheme = () => setIsDark((prev) => !prev);
  const theme = isDark ? dark : light;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
