import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from '../components/LinearGradient';
import { Mic, MicOff, Volume2, VolumeX, PhoneOff, ArrowLeft, Clock, DollarSign, CheckCircle, X } from 'lucide-react-native';
import { useAudio } from '../context/AudioContext';
import { playEndTone, stopSound } from '../utils/sounds';
import { useTheme } from '../context/ThemeContext';
import { useWallet } from '../context/WalletContext';
import { useBilling } from '../context/BillingContext';

const { width } = Dimensions.get('window');

function calcCharge(
  seconds: number,
  pricePerMinute: number,
  minimumCharge: number,
  freeMinutes: number,
  taxRate: number,
  billingEnabled: boolean,
) {
  if (!billingEnabled) return 0;
  const perSec = pricePerMinute / 60;
  const billableSecs = Math.max(0, seconds - freeMinutes * 60);
  if (billableSecs <= 0) return 0;
  const raw = billableSecs * perSec;
  const charged = Math.max(Math.round(raw), minimumCharge);
  return Math.round(charged + charged * (taxRate / 100));
}

export default function ActiveCallScreen() {
  const router = useRouter();
  const { name, phone } = useLocalSearchParams();
  const { isMuted, isSpeaker, toggleMute, toggleSpeaker, startCallAudio, stopCallAudio } = useAudio();
  const [duration, setDuration] = useState(0);
  const [finalDuration, setFinalDuration] = useState(0);
  const endedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { theme } = useTheme();
  const { deduct } = useWallet();
  const { config } = useBilling();
  const [showSummary, setShowSummary] = useState(false);
  const [callCharge, setCallCharge] = useState(0);
  const [insufficient, setInsufficient] = useState(false);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    startCallAudio();
    intervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (!endedRef.current) {
        stopCallAudio();
      }
    };
  }, []);

  const handleEndCall = () => {
    endedRef.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
    playEndTone();
    stopCallAudio();

    const finalSecs = duration;
    setFinalDuration(finalSecs);

    const charge = calcCharge(
      finalSecs,
      config.pricePerMinute,
      config.minimumCharge,
      config.freeMinutes,
      config.taxRate,
      config.billingEnabled,
    );
    setCallCharge(charge);

    if (charge > 0) {
      const ok = deduct(charge, `Call with ${name || phone || 'Unknown'} (${formatDuration(finalSecs)})`);
      if (!ok) {
        setInsufficient(true);
      }
    }
    setShowSummary(true);
  };

  const handleDismiss = () => {
    setShowSummary(false);
    router.back();
  };

  const contactName = name ? String(name) : (phone ? String(phone) : '');
  const contactPhone = phone ? String(phone) : 'Dialing...';
  const initial = contactName.charAt(0).toUpperCase();
  const isFree = !config.billingEnabled || callCharge === 0;

  return (
    <LinearGradient
      colors={theme.isDark ? ['#0B1121', '#0F172A', '#1E293B'] : ['#1E3A5F', '#172C46', '#0B1B33']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.wrapper}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Caller Info */}
          <View style={styles.callerInfo}>
            <View style={styles.avatarContainer}>
              <LinearGradient colors={['#268EBA', '#1E3A5F']} style={styles.avatarGradient}>
                <Text style={styles.avatarText}>{initial}</Text>
              </LinearGradient>
            </View>
            <Text style={styles.nameText}>{contactName}</Text>
            <Text style={styles.statusText}>{formatDuration(duration)}</Text>
            <Text style={[styles.phoneText, { color: theme.textTertiary }]}>{contactPhone}</Text>
          </View>

          {/* Controls */}
          <View style={styles.controlsContainer}>
            <View style={styles.controlsRow}>
              <TouchableOpacity style={[styles.controlBtn, isMuted && styles.controlBtnActive]} onPress={toggleMute}>
                {isMuted ? <MicOff size={28} color="#EF4444" /> : <Mic size={28} color="#FFFFFF" />}
                <Text style={[styles.controlLabel, isMuted && { color: '#EF4444' }]}>
                  {isMuted ? 'Muted' : 'Mute'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]} onPress={toggleSpeaker}>
                {isSpeaker ? <Volume2 size={28} color="#34D399" /> : <VolumeX size={28} color="#FFFFFF" />}
                <Text style={[styles.controlLabel, isSpeaker && { color: '#34D399' }]}>
                  {isSpeaker ? 'Speaker' : 'Earpiece'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* End Call Button */}
            <View style={styles.endCallContainer}>
              <TouchableOpacity style={styles.endCallBtn} onPress={handleEndCall}>
                <PhoneOff size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Call Summary Modal */}
      <Modal visible={showSummary} transparent animationType="fade" onRequestClose={handleDismiss}>
        <View style={styles.modalOverlay}>
          <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
            <TouchableOpacity style={styles.summaryClose} onPress={handleDismiss}>
              <X size={20} color={theme.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.summaryIconWrap, { backgroundColor: isFree ? '#10B98115' : insufficient ? '#EF444415' : '#3B82F615' }]}>
              {isFree ? (
                <CheckCircle size={32} color="#10B981" />
              ) : insufficient ? (
                <X size={32} color="#EF4444" />
              ) : (
                <DollarSign size={32} color="#3B82F6" />
              )}
            </View>

            <Text style={[styles.summaryTitle, { color: theme.text }]}>
              {isFree ? 'Call Complete' : insufficient ? 'Insufficient Balance' : 'Call Charged'}
            </Text>

            <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />

            <View style={styles.summaryRow}>
              <View style={[styles.summaryIconSmall, { backgroundColor: '#8B5CF615' }]}>
                <Clock size={16} color="#8B5CF6" />
              </View>
              <Text style={[styles.summaryLabel, { color: theme.textTertiary }]}>Duration</Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>{formatDuration(finalDuration)}</Text>
            </View>

            <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />

            <View style={styles.summaryRow}>
              <View style={[styles.summaryIconSmall, { backgroundColor: '#F59E0B15' }]}>
                <DollarSign size={16} color="#F59E0B" />
              </View>
              <Text style={[styles.summaryLabel, { color: theme.textTertiary }]}>Charged</Text>
              <Text style={[styles.summaryValue, { color: isFree ? '#10B981' : insufficient ? '#EF4444' : theme.text }]}>
                {isFree ? 'FREE' : `₦${callCharge.toLocaleString()}`}
              </Text>
            </View>

            {config.taxRate > 0 && !isFree && (
              <>
                <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.textTertiary }]}>VAT ({config.taxRate}%)</Text>
                  <Text style={[styles.summaryValue, { color: theme.textSecondary }]}>
                    ₦{Math.round(callCharge * config.taxRate / (100 + config.taxRate))}
                  </Text>
                </View>
              </>
            )}

            {insufficient && (
              <Text style={styles.insufficientText}>
                Top up your wallet to continue making calls
              </Text>
            )}

            <TouchableOpacity
              style={[styles.dismissBtn, { backgroundColor: isFree ? '#10B981' : insufficient ? '#EF4444' : theme.accent }]}
              onPress={handleDismiss}
            >
              <Text style={styles.dismissText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  wrapper: { flex: 1, justifyContent: 'space-between' },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center', marginLeft: 20, marginTop: 12,
  },
  callerInfo: { alignItems: 'center', marginTop: 60 },
  avatarContainer: {
    width: 120, height: 120, borderRadius: 60, marginBottom: 24,
    boxShadow: '0 8px 16px rgba(38,142,186,0.5)', elevation: 10,
  },
  avatarGradient: { flex: 1, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 48, fontWeight: '700', color: '#FFFFFF' },
  nameText: { fontSize: 32, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  statusText: { fontSize: 20, fontWeight: '500', color: '#8BB662', marginBottom: 8 },
  phoneText: { fontSize: 16 },
  controlsContainer: { paddingBottom: 50, paddingHorizontal: 30 },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 40 },
  controlBtn: {
    width: width * 0.22, height: width * 0.22, borderRadius: (width * 0.22) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  controlBtnActive: { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
  controlLabel: { color: '#FFFFFF', fontSize: 13, marginTop: 8, textAlign: 'center', fontWeight: '500' },
  endCallContainer: { alignItems: 'center' },
  endCallBtn: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#EF4444',
    justifyContent: 'center', alignItems: 'center',
    boxShadow: '0 8px 16px rgba(239,68,68,0.5)', elevation: 10,
  },
  /* Summary Modal */
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  summaryCard: {
    width: '82%', borderRadius: 28, padding: 28, alignItems: 'center',
    boxShadow: '0 10px 24px rgba(0,0,0,0.15)', elevation: 10,
  },
  summaryClose: {
    position: 'absolute', top: 16, right: 16, width: 32, height: 32,
    borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  summaryIconWrap: {
    width: 64, height: 64, borderRadius: 24, justifyContent: 'center',
    alignItems: 'center', marginBottom: 16,
  },
  summaryTitle: { fontSize: 20, fontWeight: '800', marginBottom: 20 },
  summaryDivider: { height: 1, width: '100%' },
  summaryRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, width: '100%',
  },
  summaryIconSmall: {
    width: 32, height: 32, borderRadius: 10, justifyContent: 'center',
    alignItems: 'center', marginRight: 12,
  },
  summaryLabel: { fontSize: 14, fontWeight: '500', flex: 1 },
  summaryValue: { fontSize: 16, fontWeight: '700' },
  insufficientText: {
    color: '#EF4444', fontSize: 13, fontWeight: '600', textAlign: 'center',
    marginTop: 8, marginBottom: 4,
  },
  dismissBtn: {
    width: '100%', height: 48, borderRadius: 16, justifyContent: 'center',
    alignItems: 'center', marginTop: 20,
  },
  dismissText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
