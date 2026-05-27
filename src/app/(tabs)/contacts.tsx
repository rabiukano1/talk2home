import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Phone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useContacts } from '../../context/ContactsContext';
import { Header } from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';

export default function ContactsScreen() {
  const router = useRouter();
  const { contacts } = useContacts();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.content}>
        <Header title="Contacts" showBack />

        <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
          <Search size={18} color={theme.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search contacts"
            placeholderTextColor={theme.textTertiary}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {contacts.map((contact, index) => (
            <View key={index} style={[styles.contactItem, { backgroundColor: theme.surface }]}>
              <View style={[styles.avatar, { backgroundColor: contact.color + '20' }]}>
                <Text style={[styles.avatarText, { color: contact.color }]}>
                  {contact.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, { color: theme.text }]}>{contact.name}</Text>
                <Text style={[styles.contactPhone, { color: theme.textTertiary }]}>{contact.phone}</Text>
              </View>
              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => router.push({ 
                  pathname: '/active-call', 
                  params: { name: contact.name, phone: contact.phone } 
                })}
              >
                <Phone size={18} color={theme.accent} />
              </TouchableOpacity>
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 12,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
});
