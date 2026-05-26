import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, MicOff, Volume2, PhoneOff, Grid as Keypad, ArrowLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ActiveCallScreen() {
  const router = useRouter();
  const { name, phone } = useLocalSearchParams();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [duration, setDuration] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Format duration as mm:ss
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleEndCall = () => {
    router.back();
  };

  const contactName = name ? String(name) : 'Unknown';
  const contactPhone = phone ? String(phone) : 'Dialing...';
  const initial = contactName.charAt(0).toUpperCase();

  return (
    <LinearGradient
      colors={['#1E3A5F', '#172C46', '#0B1B33']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />}
        >
          {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Caller Info */}
        <View style={styles.callerInfo}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#268EBA', '#1E3A5F']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>{initial}</Text>
            </LinearGradient>
          </View>
          <Text style={styles.nameText}>{contactName}</Text>
          <Text style={styles.statusText}>{formatDuration(duration)}</Text>
          <Text style={styles.phoneText}>{contactPhone}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.controlsRow}>
            <TouchableOpacity 
              style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
              onPress={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff size={28} color="#FFFFFF" /> : <Mic size={28} color="#FFFFFF" />}
              <Text style={styles.controlLabel}>{isMuted ? 'Muted' : 'Mute'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn}>
              <Keypad size={28} color="#FFFFFF" />
              <Text style={styles.controlLabel}>Keypad</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]}
              onPress={() => setIsSpeaker(!isSpeaker)}
            >
              <Volume2 size={28} color="#FFFFFF" />
              <Text style={styles.controlLabel}>{isSpeaker ? 'Speaker' : 'Audio'}</Text>
            </TouchableOpacity>
          </View>

          {/* End Call Button */}
          <View style={styles.endCallContainer}>
            <TouchableOpacity style={styles.endCallBtn} onPress={handleEndCall}>
              <PhoneOff size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 12,
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: 60,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    shadowColor: '#268EBA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarGradient: {
    flex: 1,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nameText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#8BB662',
    marginBottom: 8,
  },
  phoneText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  controlsContainer: {
    paddingBottom: 50,
    paddingHorizontal: 30,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  controlBtn: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.2) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  controlBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  controlLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  endCallContainer: {
    alignItems: 'center',
  },
  endCallBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
});
