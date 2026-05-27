import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Wallet,
  Plus,
  Send,
  Phone,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  Coins,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useWallet } from '../context/WalletContext';
import { LinearGradient } from '../components/LinearGradient';

const topUpAmounts = [500, 1000, 2000, 5000, 10000];

export default function WalletScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { balance, transactions, topUp, currency } = useWallet();
  const [showTopUp, setShowTopUp] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const handleTopUp = () => {
    const amount = selectedAmount || (parseInt(customAmount) || 0);
    if (amount <= 0) return;
    topUp(amount);
    setShowTopUp(false);
    setSelectedAmount(null);
    setCustomAmount('');
  };

  const formatDate = (d: Date) => {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < 86400000 * 7) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[d.getDay()];
    }
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.surface }]} onPress={() => router.back()}>
            <ArrowLeft size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Wallet</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={['#1E3A5F', '#185B7A', '#268EBA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceTop}>
            <View style={styles.balanceLabelRow}>
              <Wallet size={16} color="#99F6E4" />
              <Text style={styles.balanceLabel}>Available Balance</Text>
            </View>
            <View style={styles.balanceStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
          <Text style={styles.balanceAmount}>
            {currency.symbol}{balance.toLocaleString()}
          </Text>
          <Text style={styles.balanceHint}>Funds available for calls</Text>

          <View style={styles.balanceActions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#FFFFFF' }]}
              onPress={() => setShowTopUp(true)}
            >
              <Plus size={18} color="#1E3A5F" />
              <Text style={styles.actionBtnText}>Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
              onPress={() => router.push('/transfer' as any)}
            >
              <Send size={18} color="#FFFFFF" />
              <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.statIcon, { backgroundColor: '#10B98115' }]}>
              <ArrowDownLeft size={18} color="#10B981" />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {currency.symbol}{transactions.filter(t => t.type === 'topup').reduce((s, t) => s + t.amount, 0)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Total Funded</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.statIcon, { backgroundColor: '#EF444415' }]}>
              <ArrowUpRight size={18} color="#EF4444" />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {currency.symbol}{transactions.filter(t => t.type === 'call').reduce((s, t) => s + t.amount, 0)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Spent on Calls</Text>
          </View>
        </View>

        {/* Transactions */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Transaction History</Text>
        <View style={[styles.transactionCard, { backgroundColor: theme.surface }]}>
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Coins size={32} color={theme.textTertiary} />
              <Text style={[styles.emptyText, { color: theme.textTertiary }]}>No transactions yet</Text>
            </View>
          ) : (
            transactions.map((tx, i) => {
              const isCredit = tx.type === 'topup' || tx.type === 'refund';
              const isTransfer = tx.type === 'transfer';
              const txColor = isCredit ? '#10B981' : isTransfer ? '#8B5CF6' : '#EF4444';
              const txBg = isCredit ? '#10B98115' : isTransfer ? '#8B5CF615' : '#EF444415';
              return (
                <View
                  key={tx.id}
                  style={[
                    styles.txItem,
                    i < transactions.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
                  ]}
                >
                  <View style={[styles.txIcon, { backgroundColor: txBg }]}>
                    {isCredit ? (
                      <ArrowDownLeft size={16} color="#10B981" />
                    ) : isTransfer ? (
                      <Send size={16} color="#8B5CF6" />
                    ) : (
                      <Phone size={16} color="#EF4444" />
                    )}
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={[styles.txDesc, { color: theme.text }]}>{tx.description}</Text>
                    <Text style={[styles.txDate, { color: theme.textTertiary }]}>{formatDate(tx.date)}</Text>
                  </View>
                  <Text style={[styles.txAmount, { color: txColor }]}>
                    {isCredit ? '+' : '-'}{currency.symbol}{tx.amount.toLocaleString()}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Top-Up Modal */}
      <Modal visible={showTopUp} transparent animationType="slide" onRequestClose={() => setShowTopUp(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: theme.text }]}>Top Up Wallet</Text>
            <Text style={[styles.modalSub, { color: theme.textTertiary }]}>Select or enter an amount</Text>

            <View style={styles.amountGrid}>
              {topUpAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.amountChip,
                    { backgroundColor: theme.surfaceAlt, borderColor: theme.border },
                    selectedAmount === amount && { backgroundColor: theme.accent + '15', borderColor: theme.accent },
                  ]}
                  onPress={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                >
                  <Text style={[
                    styles.amountChipText,
                    { color: theme.text },
                    selectedAmount === amount && { color: theme.accent },
                  ]}>
                    {currency.symbol}{amount.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customRow}>
              <Text style={[styles.customPrefix, { color: theme.textSecondary }]}>{currency.symbol}</Text>
              <TextInput
                style={[styles.customInput, { color: theme.text, backgroundColor: theme.surfaceAlt }]}
                value={customAmount}
                onChangeText={(t) => { setCustomAmount(t); setSelectedAmount(null); }}
                placeholder="Custom amount"
                placeholderTextColor={theme.textTertiary}
                keyboardType="number-pad"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                { backgroundColor: theme.accent },
                !selectedAmount && !customAmount && { opacity: 0.5 },
              ]}
              onPress={handleTopUp}
              disabled={!selectedAmount && !customAmount}
            >
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.confirmBtnText}>
                Add {currency.symbol}{selectedAmount || (parseInt(customAmount) || 0).toLocaleString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: theme.border }]}
              onPress={() => { setShowTopUp(false); setSelectedAmount(null); setCustomAmount(''); }}
            >
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  /* Balance Card */
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  balanceLabel: {
    color: '#CCFBF1',
    fontSize: 13,
    fontWeight: '600',
  },
  balanceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  statusText: {
    color: '#CCFBF1',
    fontSize: 12,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -1,
  },
  balanceHint: {
    fontSize: 14,
    color: '#99F6E4',
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: 'row', gap: 12,
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 16,
  },
  actionBtnText: {
    fontSize: 16, fontWeight: '700', color: '#1E3A5F',
  },
  /* Stats */
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  /* Transactions */
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  transactionCard: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  txInfo: {
    flex: 1,
  },
  txDesc: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  txDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  amountChip: {
    width: '30%',
    flexGrow: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  amountChipText: {
    fontSize: 15,
    fontWeight: '700',
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  customPrefix: {
    fontSize: 20,
    fontWeight: '700',
  },
  customInput: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 10,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
