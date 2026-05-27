import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';

const recentCalls = [
  { name: 'Dad', type: 'missed', time: '2:15 PM', icon: PhoneMissed, color: '#EF4444' },
  { name: 'Sarah Miller', type: 'outgoing', time: '11:30 AM', icon: PhoneOutgoing, color: '#268EBA' },
  { name: 'Home Hub', type: 'incoming', time: 'Yesterday', icon: PhoneIncoming, color: '#268EBA' },
  { name: 'Alice Johnson', type: 'missed', time: 'Yesterday', icon: PhoneMissed, color: '#EF4444' },
  { name: 'Bob Smith', type: 'outgoing', time: '2 days ago', icon: PhoneOutgoing, color: '#268EBA' },
];

export default function CallsScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header title="Calls" showBack />

        {recentCalls.map((call, index) => {
          const Icon = call.icon;
          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.callItem, { backgroundColor: theme.surface }]}
              onPress={() => router.push({ 
                pathname: '/active-call', 
                params: { name: call.name, phone: 'Unknown' } 
              })}
            >
              <View style={[styles.callIcon, { backgroundColor: call.color + '15' }]}>
                <Icon size={18} color={call.color} />
              </View>
              <View style={styles.callInfo}>
                <Text style={[styles.callName, { color: theme.text }]}>{call.name}</Text>
                <Text style={[styles.callType, { color: theme.textSecondary }]}>
                  {call.type.charAt(0).toUpperCase() + call.type.slice(1)}
                </Text>
              </View>
              <Text style={[styles.callTime, { color: theme.textTertiary }]}>{call.time}</Text>
              <Phone size={18} color={theme.accent} />
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  callIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  callInfo: {
    flex: 1,
  },
  callName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  callType: {
    fontSize: 12,
  },
  callTime: {
    fontSize: 13,
    marginRight: 12,
  },
});
