import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from '../../components/LinearGradient';
import { Header } from '../../components/Header';
import { useRouter } from 'expo-router';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Wifi, Wallet, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useWallet } from '../../context/WalletContext';

const recentCalls = [
  { name: 'Mom', type: 'incoming', time: '2 min ago', duration: '1:23' },
  { name: 'Dad', type: 'outgoing', time: '15 min ago', duration: '3:45' },
  { name: 'Alice', type: 'missed', time: '1 hr ago', duration: null },
  { name: 'Front Gate', type: 'incoming', time: '2 hrs ago', duration: '0:45' },
  { name: 'Bob', type: 'outgoing', time: '3 hrs ago', duration: '5:12' },
];

const callIconMap: Record<string, { icon: React.ComponentType<{ size: number; color: string }>; color: string }> = {
  incoming: { icon: PhoneIncoming, color: '#34D399' },
  outgoing: { icon: PhoneOutgoing, color: '#268EBA' },
  missed: { icon: PhoneMissed, color: '#EF4444' },
};

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const { balance, currency } = useWallet();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.textTertiary} />}
      >
        <Header title="Talk2Home" showProfile />

        {/* Smart Gateway */}
        <LinearGradient
          colors={['#1E3A5F', '#185B7A', '#268EBA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroStatusRow}>
              <View style={styles.heroStatusDot} />
              <Text style={styles.heroStatusText}>All systems online</Text>
            </View>
            <Wifi color="#99F6E4" size={20} />
          </View>
          <Text style={styles.heroTitle}>Smart Gateway</Text>
          <TouchableOpacity
            style={styles.heroMetrics}
            onPress={() => router.push('/wallet' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.walletIconWrap}>
              <Wallet size={18} color="#FFFFFF" />
            </View>
            <View style={styles.walletInfo}>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletValue}>{currency.symbol}{balance.toLocaleString()}</Text>
            </View>
            <ChevronRight size={18} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Recent Calls */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Calls</Text>
        <View style={[styles.callList, { gap: 10 }]}>
          {recentCalls.map((call, index) => {
            const { icon: Icon, color } = callIconMap[call.type];
            return (
              <TouchableOpacity
                key={index}
                style={[styles.callItem, { backgroundColor: theme.surface }]}
                onPress={() => router.push({
                  pathname: '/active-call',
                  params: { name: call.name, phone: call.name },
                })}
              >
                <View style={[styles.callIconWrap, { backgroundColor: color + '15' }]}>
                  <Icon size={18} color={color} />
                </View>
                <View style={styles.callInfo}>
                  <Text style={[styles.callName, { color: theme.text }]}>{call.name}</Text>
                  <Text style={[styles.callMeta, { color: theme.textTertiary }]}>
                    {call.type === 'missed' ? 'Missed' : call.duration}
                    {' · '}{call.time}
                  </Text>
                </View>
                <Phone size={18} color={theme.textTertiary} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  heroStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#34D399',
    marginRight: 8,
  },
  heroStatusText: {
    color: '#CCFBF1',
    fontSize: 13,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  heroMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 16,
    padding: 16,
  },
  walletIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  walletInfo: { flex: 1 },
  walletLabel: {
    color: '#99F6E4',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  walletValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  callList: {},
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  callIconWrap: {
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
    fontWeight: '700',
    marginBottom: 2,
  },
  callMeta: {
    fontSize: 12,
  },
});
