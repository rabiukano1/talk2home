import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const recentCalls = [
  { name: 'Dad', type: 'missed', time: '2:15 PM', icon: PhoneMissed, color: '#EF4444' },
  { name: 'Sarah Miller', type: 'outgoing', time: '11:30 AM', icon: PhoneOutgoing, color: '#268EBA' },
  { name: 'Home Hub', type: 'incoming', time: 'Yesterday', icon: PhoneIncoming, color: '#268EBA' },
  { name: 'Alice Johnson', type: 'missed', time: 'Yesterday', icon: PhoneMissed, color: '#EF4444' },
  { name: 'Bob Smith', type: 'outgoing', time: '2 days ago', icon: PhoneOutgoing, color: '#268EBA' },
];

export default function CallsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(tabs)')}>
            <ArrowLeft size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.title}>Calls</Text>
          <View style={styles.backBtn} />
        </View>

        {recentCalls.map((call, index) => {
          const Icon = call.icon;
          return (
            <TouchableOpacity 
              key={index} 
              style={styles.callItem}
              onPress={() => router.push({ 
                pathname: '/active-call', 
                params: { name: call.name, phone: 'Unknown' } 
              })}
            >
              <View style={[styles.callIcon, { backgroundColor: call.color + '15' }]}>
                <Icon size={18} color={call.color} />
              </View>
              <View style={styles.callInfo}>
                <Text style={styles.callName}>{call.name}</Text>
                <Text style={styles.callType}>{call.type.charAt(0).toUpperCase() + call.type.slice(1)}</Text>
              </View>
              <Text style={styles.callTime}>{call.time}</Text>
              <Phone size={18} color="#0D9488" />
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
    backgroundColor: '#EAF0F6',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E3A5F',
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    color: '#1E3A5F',
    marginBottom: 2,
  },
  callType: {
    fontSize: 12,
    color: '#64748B',
  },
  callTime: {
    fontSize: 13,
    color: '#94A3B8',
    marginRight: 12,
  },
});
