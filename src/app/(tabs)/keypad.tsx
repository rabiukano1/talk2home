import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Phone, Delete, UserPlus } from 'lucide-react-native';
import { LinearGradient } from '../../components/LinearGradient';
import { Header } from '../../components/Header';
import { useContacts } from '../../context/ContactsContext';
import { playDTMF, playRingtone, stopSound } from '../../utils/sounds';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.21;

const keypadLayout = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
];

export default function KeypadScreen() {
  const router = useRouter();
  const { addContact } = useContacts();
  const { theme } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [contactName, setContactName] = useState('');

  const handlePress = (key: string) => {
    setPhoneNumber((prev) => prev + key);
    playDTMF(key);
  };

  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPhoneNumber('');
  };

  const handleSaveContact = () => {
    if (phoneNumber.trim().length === 0) return;
    setContactName('');
    setShowSaveModal(true);
  };

  const handleConfirmSave = () => {
    const name = contactName.trim();
    if (!name) return;
    addContact(name, phoneNumber);
    setShowSaveModal(false);
    setPhoneNumber('');
  };

  const ringtoneRef = useRef<string | null>(null);

  const handleCall = () => {
    if (phoneNumber.trim().length === 0) return;
    playRingtone().then((id) => { ringtoneRef.current = id; });
    router.push({
      pathname: '/active-call',
      params: { name: 'Unknown', phone: phoneNumber },
    });
    setTimeout(() => stopSound(ringtoneRef.current), 3000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Header showBack showLogo={false} />
        <View style={styles.displayContainer}>
          <Text style={[styles.numberDisplay, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.4}>
            {phoneNumber || ''}
          </Text>
        </View>

        <View style={styles.keypadContainer}>
        {keypadLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={[styles.keyButton, { backgroundColor: theme.surface }]}
                onPress={() => handlePress(key)}
              >
                <Text style={[styles.keyText, { color: theme.text }]}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.actionRow}>
          <View style={styles.actionSide}>
            {phoneNumber.length > 0 && (
              <TouchableOpacity
                style={[styles.actionSideBtn, { backgroundColor: theme.accent + '20' }]}
                onPress={handleSaveContact}
              >
                <UserPlus size={26} color={theme.accent} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={[styles.callButton, { shadowColor: theme.isDark ? '#38BDF8' : '#1E3A5F' }]} onPress={handleCall}>
            <LinearGradient
              colors={theme.isDark ? ['#38BDF8', '#0EA5E9'] : ['#1E3A5F', '#268EBA']}
              style={styles.callGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Phone size={32} color="#FFFFFF" fill="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.actionSide}>
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: theme.surface }, phoneNumber.length > 0 && { backgroundColor: theme.surfaceAlt }]}
              onPress={handleDelete}
              onLongPress={() => setPhoneNumber('')}
              disabled={phoneNumber.length === 0}
            >
              <Delete size={26} color={phoneNumber.length > 0 ? theme.text : theme.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>

      <Modal visible={showSaveModal} transparent animationType="fade" onRequestClose={() => setShowSaveModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Save Contact</Text>
            <Text style={[styles.modalPhone, { color: theme.textSecondary }]}>{phoneNumber}</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.surfaceAlt, color: theme.text, borderColor: theme.border }]}
              placeholder="Contact name"
              placeholderTextColor={theme.textTertiary}
              value={contactName}
              onChangeText={setContactName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalCancelBtn, { backgroundColor: theme.border }]} onPress={() => setShowSaveModal(false)}>
                <Text style={[styles.modalCancelText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, { backgroundColor: theme.accent }, !contactName.trim() && styles.modalSaveBtnDisabled]}
                onPress={handleConfirmSave}
                disabled={!contactName.trim()}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  numberDisplay: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: 2,
    textAlign: 'center',
  },
  keypadContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  keyButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  keyText: {
    fontSize: 34,
    fontWeight: '400',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  actionSide: {
    width: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSideBtn: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    width: BUTTON_SIZE * 1.15,
    height: BUTTON_SIZE * 1.15,
    borderRadius: (BUTTON_SIZE * 1.15) / 2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  callGradient: {
    flex: 1,
    borderRadius: (BUTTON_SIZE * 1.15) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 60,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalPhone: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 24,
  },
  modalInput: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSaveBtnDisabled: {
    opacity: 0.5,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
