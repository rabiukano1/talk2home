import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ContactsProvider } from '../context/ContactsContext';
import { AudioProvider } from '../context/AudioContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { UserProvider } from '../context/UserContext';
import { BillingProvider } from '../context/BillingContext';
import { WalletProvider } from '../context/WalletContext';

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
        <UserProvider>
          <BillingProvider>
            <WalletProvider>
            <ThemeProvider>
              <RootLayoutInner />
            </ThemeProvider>
            </WalletProvider>
          </BillingProvider>
        </UserProvider>
      </ContactsProvider>
    </AudioProvider>
  );
}
