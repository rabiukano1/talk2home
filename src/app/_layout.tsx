import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ContactsProvider } from '../context/ContactsContext';

export default function RootLayout() {
  return (
    <ContactsProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="dark" />
    </ContactsProvider>
  );
}
