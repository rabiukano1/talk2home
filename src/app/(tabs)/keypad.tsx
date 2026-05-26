import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Phone, Delete, UserPlus, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContacts } from '../../context/ContactsContext';

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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handlePress = (key: string) => {
    setPhoneNumber((prev) => prev + key);
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

  const handleCall = () => {
    if (phoneNumber.trim().length === 0) return;
    router.push({
      pathname: '/active-call',
      params: { name: 'Unknown', phone: phoneNumber },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.headerBackBtn} onPress={() => router.push('/(tabs)')}>
            <ArrowLeft size={22} color="#0F172A" />
          </TouchableOpacity>
        </View>
        <View style={styles.displayContainer}>
          <Text style={styles.numberDisplay} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.4}>
            {phoneNumber || ''}
          </Text>
        </View>

        <View style={styles.keypadContainer}>
        {keypadLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.keyButton}
                onPress={() => handlePress(key)}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.actionRow}>
          <View style={styles.actionSide}>
            {phoneNumber.length > 0 && (
              <TouchableOpacity
                style={styles.actionSideBtn}
                onPress={handleSaveContact}
              >
                <UserPlus size={26} color="#1E3A5F" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <LinearGradient
              colors={['#1E3A5F', '#268EBA']}
              style={styles.callGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Phone size={32} color="#FFFFFF" fill="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.actionSide}>
            <TouchableOpacity
              style={[styles.deleteButton, phoneNumber.length > 0 && styles.deleteButtonActive]}
              onPress={handleDelete}
              onLongPress={() => setPhoneNumber('')}
              disabled={phoneNumber.length === 0}
            >
              <Delete size={26} color={phoneNumber.length > 0 ? '#475569' : '#CBD5E1'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>

      <Modal visible={showSaveModal} transparent animationType="fade" onRequestClose={() => setShowSaveModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Contact</Text>
            <Text style={styles.modalPhone}>{phoneNumber}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Contact name"
              placeholderTextColor="#94A3B8"
              value={contactName}
              onChangeText={setContactName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowSaveModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, !contactName.trim() && styles.modalSaveBtnDisabled]}
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
    backgroundColor: '#EAF0F6',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerBar: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  headerBackBtn: {
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
    color: '#1E3A5F',
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
    backgroundColor: '#FFFFFF',
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
    color: '#1E3A5F',
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
    backgroundColor: '#D4F0F9',
  },
  callButton: {
    width: BUTTON_SIZE * 1.15,
    height: BUTTON_SIZE * 1.15,
    borderRadius: (BUTTON_SIZE * 1.15) / 2,
    shadowColor: '#1E3A5F',
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
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  deleteButtonActive: {
    backgroundColor: '#EAF0F6',
    shadowOpacity: 0.1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 60,
    backgroundColor: '#FFFFFF',
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
    color: '#0F172A',
    marginBottom: 8,
  },
  modalPhone: {
    fontSize: 18,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 24,
  },
  modalInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSaveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#268EBA',
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
