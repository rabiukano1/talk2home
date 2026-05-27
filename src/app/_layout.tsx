import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ContactsProvider } from '../context/ContactsContext';
import { AudioProvider } from '../context/AudioContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function RootLayoutInner() {
  const { theme } = useTheme();
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AudioProvider>
      <ContactsProvider>
        <ThemeProvider>
          <RootLayoutInner />
        </ThemeProvider>
      </ContactsProvider>
    </AudioProvider>
  );
}
