import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  Phone,
  Check,
  Send,
  X,
  ArrowUpRight,
  Wallet,
  Mail,
  AtSign,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useWallet } from '../context/WalletContext';
import { useContacts } from '../context/ContactsContext';
import { LinearGradient } from '../components/LinearGradient';

type Method = 'email' | 'username' | 'phone';

const quickAmounts = [500, 1000, 2000, 5000];
const methods: { key: Method; label: string; icon: any }[] = [
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'username', label: 'Username', icon: AtSign },
  { key: 'phone', label: 'Phone', icon: Phone },
];

export default function TransferScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { balance, sendTransfer, currency } = useWallet();
  const { contacts } = useContacts();

  const [method, setMethod] = useState<Method>('phone');
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<{ name: string; phone: string } | null>(null);
  const [manualPhone, setManualPhone] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [usernameVal, setUsernameVal] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  const recipientName = selectedContact?.name || emailVal || usernameVal || manualPhone;
  const recipientPhone = selectedContact?.phone || manualPhone || emailVal || usernameVal;
  const numAmount = parseInt(amount) || 0;

  const canTransfer = (() => {
    if (numAmount <= 0 || numAmount > balance) return false;
    if (selectedContact) return true;
    if (method === 'email') return emailVal.includes('@');
    if (method === 'username') return usernameVal.length >= 2;
    if (method === 'phone') return manualPhone.length >= 3;
    return false;
  })();

  const handleConfirm = () => {
    const ok = sendTransfer(numAmount, recipientName, recipientPhone);
    if (ok) {
      setConfirmVisible(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.back();
      }, 2500);
    }
  };

  const clearRecipient = () => {
    setSelectedContact(null);
    setManualPhone('');
    setEmailVal('');
    setUsernameVal('');
    setSearch('');
  };

  const renderRecipientInput = () => {
    if (selectedContact) {
      return (
        <View style={[styles.selectedCard, { backgroundColor: theme.surface }]}>
          <View style={[styles.selectedAvatar, { backgroundColor: '#3B82F615' }]}>
            <Text style={styles.selectedAvatarText}>
              {selectedContact.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.selectedName, { color: theme.text }]}>{selectedContact.name}</Text>
            <Text style={[styles.selectedPhone, { color: theme.textTertiary }]}>{selectedContact.phone}</Text>
          </View>
          <TouchableOpacity style={[styles.clearBtn, { backgroundColor: theme.border }]} onPress={clearRecipient}>
            <X size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      );
    }

    switch (method) {
      case 'email':
        return (
          <View style={[styles.inputCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Mail size={18} color={theme.textTertiary} />
            <TextInput
              style={[styles.methodInput, { color: theme.text }]}
              value={emailVal}
              onChangeText={setEmailVal}
              placeholder="user@example.com"
              placeholderTextColor={theme.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        );

      case 'username':
        return (
          <View style={[styles.inputCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <AtSign size={18} color={theme.textTertiary} />
            <TextInput
              style={[styles.methodInput, { color: theme.text }]}
              value={usernameVal}
              onChangeText={setUsernameVal}
              placeholder="Enter username"
              placeholderTextColor={theme.textTertiary}
              autoCapitalize="none"
            />
          </View>
        );

      case 'phone':
        return (
          <>
            <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Search size={18} color={theme.textTertiary} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                value={search}
                onChangeText={setSearch}
                placeholder="Search contacts..."
                placeholderTextColor={theme.textTertiary}
              />
            </View>

            {filtered.map((contact, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.contactItem, { borderBottomColor: theme.border }]}
                onPress={() => {
                  setSelectedContact(contact);
                  setManualPhone('');
                  setSearch('');
                }}
              >
                <View style={[styles.contactAvatar, { backgroundColor: contact.color + '20' }]}>
                  <Text style={[styles.contactAvatarText, { color: contact.color }]}>
                    {contact.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.contactName, { color: theme.text }]}>{contact.name}</Text>
                  <Text style={[styles.contactPhone, { color: theme.textTertiary }]}>{contact.phone}</Text>
                </View>
                <ArrowUpRight size={16} color={theme.textTertiary} />
              </TouchableOpacity>
            ))}

            <View style={[styles.manualRow, { borderTopColor: theme.border }]}>
              <Phone size={18} color={theme.textTertiary} />
              <TextInput
                style={[styles.manualInput, { color: theme.text }]}
                value={manualPhone}
                onChangeText={setManualPhone}
                placeholder="Or enter phone number"
                placeholderTextColor={theme.textTertiary}
                keyboardType="phone-pad"
              />
            </View>
          </>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.surface }]} onPress={() => router.back()}>
            <ArrowLeft size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Transfer</Text>
          <View style={[styles.balanceBadge, { backgroundColor: theme.surface }]}>
            <Wallet size={14} color={theme.textSecondary} />
            <Text style={[styles.balanceBadgeText, { color: theme.textSecondary }]}>
              {currency.symbol}{balance.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Method Tabs */}
        <View style={[styles.tabBar, { backgroundColor: theme.surface }]}>
          {methods.map((m) => {
            const Icon = m.icon;
            const active = method === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                style={[styles.tab, active && { backgroundColor: theme.accent + '15' }]}
                onPress={() => { setMethod(m.key); clearRecipient(); }}
              >
                <Icon size={16} color={active ? theme.accent : theme.textTertiary} />
                <Text style={[styles.tabLabel, { color: active ? theme.accent : theme.textTertiary }]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recipient */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Send To</Text>
        {renderRecipientInput()}

        {/* Amount */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Amount</Text>
        <View style={[styles.amountCard, { backgroundColor: theme.surface }]}>
          <View style={styles.amountRow}>
            <Text style={[styles.amountPrefix, { color: theme.textSecondary }]}>{currency.symbol}</Text>
            <TextInput
              style={[styles.amountInput, { color: theme.text }]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={theme.textTertiary}
            />
          </View>
          <Text style={[styles.balanceHint, { color: theme.textTertiary }]}>
            Available: {currency.symbol}{balance.toLocaleString()}
          </Text>
          <View style={styles.quickRow}>
            {quickAmounts.map((a) => (
              <TouchableOpacity
                key={a}
                style={[styles.quickChip, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}
                onPress={() => setAmount(a.toString())}
              >
                <Text style={[styles.quickChipText, { color: theme.text }]}>
                  {currency.symbol}{a.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Note */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 8 }]}>Note (optional)</Text>
        <TextInput
          style={[styles.noteInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
          value={note}
          onChangeText={setNote}
          placeholder="What's this for?"
          placeholderTextColor={theme.textTertiary}
        />

        {/* Transfer button */}
        <TouchableOpacity
          style={[styles.transferBtn, { backgroundColor: theme.accent, opacity: canTransfer ? 1 : 0.4 }]}
          disabled={!canTransfer}
          onPress={() => setConfirmVisible(true)}
        >
          <Send size={20} color="#FFFFFF" />
          <Text style={styles.transferBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={confirmVisible} transparent animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.confirmCard, { backgroundColor: theme.surface }]}>
            <View style={styles.confirmHeader}>
              <Text style={[styles.confirmTitle, { color: theme.text }]}>Confirm Transfer</Text>
              <TouchableOpacity onPress={() => setConfirmVisible(false)}>
                <X size={20} color={theme.textTertiary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.confirmRecipient, { backgroundColor: theme.surfaceAlt }]}>
              <View style={[styles.confirmAvatar, { backgroundColor: '#3B82F615' }]}>
                <Text style={styles.confirmAvatarText}>
                  {recipientName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={[styles.confirmRecipientName, { color: theme.text }]}>
                  {recipientName}
                </Text>
                <Text style={[styles.confirmRecipientPhone, { color: theme.textTertiary }]}>
                  via {method}
                </Text>
              </View>
            </View>

            <View style={styles.confirmAmountWrap}>
              <Text style={[styles.confirmLabel, { color: theme.textTertiary }]}>Amount</Text>
              <Text style={[styles.confirmAmount, { color: theme.text }]}>
                {currency.symbol}{numAmount.toLocaleString()}
              </Text>
            </View>

            {note ? (
              <Text style={[styles.confirmNote, { color: theme.textTertiary }]}>
                Note: {note}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.confirmSendBtn, { backgroundColor: theme.accent }]}
              onPress={handleConfirm}
            >
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.confirmSendText}>
                Send {currency.symbol}{numAmount.toLocaleString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmCancel} onPress={() => setConfirmVisible(false)}>
              <Text style={[styles.confirmCancelText, { color: theme.textTertiary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Toast */}
      <Modal visible={success} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <LinearGradient colors={['#10B981', '#047857']} style={styles.successCard}>
            <View style={styles.successIconWrap}>
              <Check size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Transfer Sent!</Text>
            <Text style={styles.successSub}>
              {currency.symbol}{numAmount.toLocaleString()} to {recipientName}
            </Text>
          </LinearGradient>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', flex: 1 },
  balanceBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
  },
  balanceBadgeText: { fontSize: 13, fontWeight: '700' },
  /* Tabs */
  tabBar: {
    flexDirection: 'row', borderRadius: 16, padding: 4, marginBottom: 24, gap: 4,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderRadius: 12,
  },
  tabLabel: { fontSize: 13, fontWeight: '700' },
  /* Recipient */
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  inputCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, borderRadius: 16, height: 52,
    borderWidth: 1.5, marginBottom: 16,
  },
  methodInput: { flex: 1, fontSize: 16, fontWeight: '600', padding: 0 },
  selectedCard: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderRadius: 18, marginBottom: 16, gap: 14,
  },
  selectedAvatar: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  selectedAvatarText: { fontSize: 18, fontWeight: '800', color: '#3B82F6' },
  selectedName: { fontSize: 16, fontWeight: '700' },
  selectedPhone: { fontSize: 13, marginTop: 1 },
  clearBtn: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, borderRadius: 16, height: 48,
    borderWidth: 1.5, marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500', padding: 0 },
  contactItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, gap: 14,
  },
  contactAvatar: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  contactAvatarText: { fontSize: 16, fontWeight: '800' },
  contactName: { fontSize: 15, fontWeight: '600' },
  contactPhone: { fontSize: 12, fontWeight: '500', marginTop: 1 },
  manualRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, borderTopWidth: 1, marginTop: 8,
  },
  manualInput: { flex: 1, fontSize: 16, fontWeight: '600', padding: 0 },
  /* Amount */
  amountCard: { borderRadius: 18, padding: 20, marginBottom: 16 },
  amountRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  amountPrefix: { fontSize: 28, fontWeight: '700', marginRight: 8 },
  amountInput: { fontSize: 36, fontWeight: '800', padding: 0, flex: 1 },
  balanceHint: { fontSize: 13, fontWeight: '500', marginBottom: 16 },
  quickRow: { flexDirection: 'row', gap: 10 },
  quickChip: {
    flex: 1, paddingVertical: 12, borderRadius: 14,
    borderWidth: 1.5, alignItems: 'center',
  },
  quickChipText: { fontSize: 14, fontWeight: '700' },
  /* Note */
  noteInput: { borderRadius: 16, padding: 14, fontSize: 15, fontWeight: '500', borderWidth: 1.5, marginBottom: 24 },
  /* Transfer Btn */
  transferBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, padding: 16, borderRadius: 16, marginTop: 8,
  },
  transferBtnText: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
  /* Confirm Modal */
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  confirmCard: {
    width: '84%', borderRadius: 28, padding: 24,
    boxShadow: '0 10px 24px rgba(0,0,0,0.15)', elevation: 10,
  },
  confirmHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  confirmTitle: { fontSize: 20, fontWeight: '800' },
  confirmRecipient: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 14, borderRadius: 16, marginBottom: 20,
  },
  confirmAvatar: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  confirmAvatarText: { fontSize: 18, fontWeight: '800', color: '#3B82F6' },
  confirmRecipientName: { fontSize: 16, fontWeight: '700' },
  confirmRecipientPhone: { fontSize: 13, marginTop: 1 },
  confirmAmountWrap: { alignItems: 'center', marginBottom: 12 },
  confirmLabel: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  confirmAmount: { fontSize: 36, fontWeight: '800' },
  confirmNote: { fontSize: 13, textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  confirmSendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 16, borderRadius: 16, marginBottom: 10,
  },
  confirmSendText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  confirmCancel: { alignItems: 'center', padding: 8 },
  confirmCancelText: { fontSize: 14, fontWeight: '600' },
  /* Success */
  successOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  successCard: {
    width: '74%', borderRadius: 28, padding: 40, alignItems: 'center',
    boxShadow: '0 10px 24px rgba(0,0,0,0.2)', elevation: 10,
  },
  successIconWrap: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  successSub: { fontSize: 15, fontWeight: '600', color: '#FFFFFF', textAlign: 'center', opacity: 0.9 },
});
