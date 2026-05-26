import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  Phone,
  MessageSquare,
  Radio,
  Camera,
  Wifi,
  Thermometer,
  Lightbulb,
  Lock,
  Volume2,
  Activity,
  Zap,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const quickActions = [
  { icon: Phone, label: 'Call', color: '#268EBA', bg: '#D4F0F9' },
  { icon: MessageSquare, label: 'Message', color: '#1E3A5F', bg: '#E8F0F6' },
  { icon: Radio, label: 'Intercom', color: '#D47B3F', bg: '#FDECDD' },
  { icon: Camera, label: 'Camera', color: '#8BB662', bg: '#EDF4E6' },
];

const devices = [
  { name: 'Living Room', icon: Lightbulb, status: 'On', detail: 'Brightness 80%', color: '#D47B3F' },
  { name: 'Front Door', icon: Lock, status: 'Locked', detail: 'Battery 85%', color: '#268EBA' },
  { name: 'Thermostat', icon: Thermometer, status: '72°F', detail: 'Eco mode', color: '#1E3A5F' },
  { name: 'Speaker', icon: Volume2, status: 'Playing', detail: 'Jazz playlist', color: '#8BB662' },
];

const activities = [
  { action: 'Doorbell rang', time: '2 min ago', icon: Camera, color: '#D47B3F' },
  { action: 'Motion detected - Kitchen', time: '15 min ago', icon: Activity, color: '#268EBA' },
  { action: 'Thermostat adjusted', time: '1 hr ago', icon: Thermometer, color: '#1E3A5F' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Image 
              source={require('../../../assets/images/logo.jpg')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.userName}>Home</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell size={22} color="#0F172A" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Hero Status Card */}
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
            <Wifi color="#99F6E4" size={22} />
          </View>
          <Text style={styles.heroTitle}>Smart Gateway</Text>
          <View style={styles.heroMetrics}>
            <View style={styles.heroMetric}>
              <Text style={styles.heroMetricValue}>6</Text>
              <Text style={styles.heroMetricLabel}>Devices</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroMetric}>
              <Text style={styles.heroMetricValue}>24°C</Text>
              <Text style={styles.heroMetricLabel}>Indoor</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroMetric}>
              <Text style={styles.heroMetricValue}>3</Text>
              <Text style={styles.heroMetricLabel}>Active</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.quickActionCard}
              onPress={() => {
                if (action.label === 'Call') {
                  router.push({ 
                    pathname: '/active-call', 
                    params: { name: 'Home Hub', phone: 'Internal' } 
                  });
                }
              }}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.bg }]}>
                <action.icon size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Devices */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Devices</Text>
          <TouchableOpacity style={styles.sectionAction}>
            <Text style={styles.sectionActionText}>See all</Text>
            <ChevronRight size={14} color="#268EBA" />
          </TouchableOpacity>
        </View>
        <View style={styles.devicesGrid}>
          {devices.map((device, index) => {
            const Icon = device.icon;
            return (
              <TouchableOpacity key={index} style={styles.deviceCard}>
                <View style={[styles.deviceIconContainer, { backgroundColor: device.color + '15' }]}>
                  <Icon size={22} color={device.color} />
                </View>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceStatus}>{device.status}</Text>
                <Text style={styles.deviceDetail}>{device.detail}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Energy Usage */}
        <View style={styles.energyCard}>
          <View style={styles.energyHeader}>
            <Zap size={20} color="#D47B3F" />
            <Text style={styles.energyTitle}>Energy Usage Today</Text>
          </View>
          <View style={styles.energyBar}>
            <View style={[styles.energyBarFill, { width: '45%' }]} />
          </View>
          <Text style={styles.energyText}>4.2 kWh used · Estimated $0.63</Text>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity style={styles.sectionAction}>
            <Text style={styles.sectionActionText}>See all</Text>
            <ChevronRight size={14} color="#268EBA" />
          </TouchableOpacity>
        </View>
        <View style={styles.activityList}>
          {activities.map((item, index) => {
            const Icon = item.icon;
            return (
              <View key={index} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: item.color + '15' }]}>
                  <Icon size={16} color={item.color} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction}>{item.action}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
              </View>
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
    backgroundColor: '#EAF0F6',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greeting: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E3A5F',
    marginTop: 2,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
  heroMetric: {
    flex: 1,
    alignItems: 'center',
  },
  heroMetricValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  heroMetricLabel: {
    color: '#99F6E4',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  heroDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  /* Section */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionActionText: {
    fontSize: 14,
    color: '#268EBA',
    fontWeight: '600',
  },

  /* Quick Actions */
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  quickActionCard: {
    alignItems: 'center',
    width: 75,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#1E3A5F',
    fontWeight: '600',
  },

  /* Devices */
  devicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  deviceCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  deviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 2,
  },
  deviceStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#268EBA',
    marginBottom: 2,
  },
  deviceDetail: {
    fontSize: 12,
    color: '#94A3B8',
  },

  /* Energy */
  energyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  energyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  energyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  energyBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  energyBarFill: {
    height: '100%',
    backgroundColor: '#D47B3F',
    borderRadius: 4,
  },
  energyText: {
    fontSize: 13,
    color: '#64748B',
  },

  /* Activity */
  activityList: {
    gap: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
