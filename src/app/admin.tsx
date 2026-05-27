import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save, Check, RefreshCw, ToggleLeft, Wallet, TrendingUp, Send, Mail, AtSign, Phone, Clock, Calendar, ArrowDownLeft, PhoneCall } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useBilling } from '../context/BillingContext';
import { useWallet } from '../context/WalletContext';

const currency = { symbol: '₦' };

export default function AdminScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { config, updateConfig } = useBilling();
  const { balance, incomeBalance, transactions, adminTopUp } = useWallet();

  const [price, setPrice] = useState(config.pricePerMinute.toString());
  const [freeMins, setFreeMins] = useState(config.freeMinutes.toString());
  const [dailyCap, setDailyCap] = useState(config.dailySpendingCap.toString());
  const [tax, setTax] = useState(config.taxRate.toString());
  const [billingOn, setBillingOn] = useState(config.billingEnabled);
  const [saved, setSaved] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [topUpAmt, setTopUpAmt] = useState('');
  const [topUpDone, setTopUpDone] = useState(false);
  const [adminMethod, setAdminMethod] = useState<'email' | 'username' | 'phone'>('phone');
  const [adminRecipient, setAdminRecipient] = useState('');
  const [activityFilter, setActivityFilter] = useState<'all' | 'calls' | 'topups'>('all');

  const priceNum = parseInt(price) || 0;
  const freeNum = parseInt(freeMins) || 0;
  const capNum = parseInt(dailyCap) || 0;
  const taxNum = parseFloat(tax) || 0;
  const perSec = priceNum > 0 ? (priceNum / 60).toFixed(2) : '0.00';

  const handleSave = () => {
    setConfirming(true);
    setTimeout(() => {
      updateConfig({
        pricePerMinute: priceNum,
        freeMinutes: freeNum,
        dailySpendingCap: capNum,
        taxRate: taxNum,
        billingEnabled: billingOn,
      });
      setConfirming(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 400);
  };

  const hasChanges =
    priceNum !== config.pricePerMinute ||
    freeNum !== config.freeMinutes ||
    capNum !== config.dailySpendingCap ||
    taxNum !== config.taxRate ||
    billingOn !== config.billingEnabled;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.back, { backgroundColor: theme.surface }]} onPress={() => router.back()}>
            <ArrowLeft size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Admin</Text>
        </View>

        {/* Income Wallet */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.walletHeader}>
            <View style={[styles.walletIcon, { backgroundColor: '#10B98115' }]}>
              <TrendingUp size={20} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.walletLabel, { color: theme.textTertiary }]}>Income Wallet</Text>
              <Text style={[styles.walletBalance, { color: theme.text }]}>
                {currency.symbol}{incomeBalance.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Wallet / Admin Top-Up */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.walletHeader}>
            <View style={[styles.walletIcon, { backgroundColor: '#3B82F615' }]}>
              <Wallet size={20} color="#3B82F6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.walletLabel, { color: theme.textTertiary }]}>User Wallet</Text>
              <Text style={[styles.walletBalance, { color: theme.text }]}>
                {currency.symbol}{balance.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Admin Transfer Method Tabs */}
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={[styles.adminTabBar, { backgroundColor: theme.surfaceAlt || theme.background }]}>
            {([
              { key: 'email', icon: Mail, label: 'Email' },
              { key: 'username', icon: AtSign, label: 'Username' },
              { key: 'phone', icon: Phone, label: 'Phone' },
            ] as const).map((m) => {
              const Icon = m.icon;
              const active = adminMethod === m.key;
              return (
                <TouchableOpacity
                  key={m.key}
                  style={[styles.adminTab, active && { backgroundColor: theme.accent + '15' }]}
                  onPress={() => { setAdminMethod(m.key); setAdminRecipient(''); }}
                >
                  <Icon size={14} color={active ? theme.accent : theme.textTertiary} />
                  <Text style={[styles.adminTabLabel, { color: active ? theme.accent : theme.textTertiary }]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.adminInputRow}>
            {adminMethod === 'email' ? (
              <Mail size={16} color={theme.textTertiary} style={{ marginLeft: 4 }} />
            ) : adminMethod === 'username' ? (
              <AtSign size={16} color={theme.textTertiary} style={{ marginLeft: 4 }} />
            ) : (
              <Phone size={16} color={theme.textTertiary} style={{ marginLeft: 4 }} />
            )}
            <TextInput
              style={[styles.adminRecipientInput, { color: theme.text }]}
              value={adminRecipient}
              onChangeText={setAdminRecipient}
              placeholder={
                adminMethod === 'email' ? 'user@example.com' :
                adminMethod === 'username' ? 'username' : 'phone number'
              }
              placeholderTextColor={theme.textTertiary}
              keyboardType={adminMethod === 'email' ? 'email-address' : 'default'}
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.topUpRow}>
            <View style={[styles.topUpInputWrap, { backgroundColor: theme.surfaceAlt || theme.background }]}>
              <Text style={[styles.prefix, { color: theme.textSecondary }]}>{currency.symbol}</Text>
              <TextInput
                style={[styles.topUpInput, { color: theme.text }]}
                value={topUpAmt}
                onChangeText={setTopUpAmt}
                keyboardType="number-pad"
                placeholder="Amount"
                placeholderTextColor={theme.textTertiary}
              />
            </View>
            <TouchableOpacity
              style={[styles.topUpBtn, { backgroundColor: theme.accent, opacity: parseInt(topUpAmt) > 0 && adminRecipient.length >= 2 ? 1 : 0.5 }]}
              disabled={!parseInt(topUpAmt) || adminRecipient.length < 2}
              onPress={() => {
                const amt = parseInt(topUpAmt);
                if (amt > 0) {
                  adminTopUp(amt);
                  setTopUpAmt('');
                  setAdminRecipient('');
                  setTopUpDone(true);
                  setTimeout(() => setTopUpDone(false), 2000);
                }
              }}
            >
              <Send size={18} color="#FFFFFF" />
              <Text style={styles.topUpBtnText}>{topUpDone ? 'Sent!' : 'Send'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Billing Toggle */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: theme.text }]}>Billing System</Text>
              <Text style={[styles.hint, { color: theme.textTertiary }]}>
                {billingOn ? 'Calls are charged' : 'Calls are free'}
              </Text>
            </View>
            <Switch
              value={billingOn}
              onValueChange={setBillingOn}
              trackColor={{ false: '#CBD5E1', true: '#10B98160' }}
              thumbColor={billingOn ? '#10B981' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* Rate */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Price per Minute</Text>
            <View style={styles.inputRow}>
              <Text style={[styles.prefix, { color: theme.textSecondary }]}>{currency.symbol}</Text>
              <TextInput style={[styles.input, { color: theme.text }]} value={price} onChangeText={setPrice} keyboardType="number-pad" placeholder="0" placeholderTextColor={theme.textTertiary} />
              <Text style={[styles.suffix, { color: theme.textTertiary }]}>/min</Text>
            </View>
            {priceNum > 0 && (
              <Text style={[styles.perSec, { color: theme.textTertiary }]}>
                = {currency.symbol}{perSec} per second
              </Text>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Free Minutes (per call)</Text>
            <View style={styles.inputRow}>
              <TextInput style={[styles.input, { color: theme.text }]} value={freeMins} onChangeText={setFreeMins} keyboardType="number-pad" placeholder="0" placeholderTextColor={theme.textTertiary} />
              <Text style={[styles.suffix, { color: theme.textTertiary }]}>min</Text>
            </View>
          </View>

        </View>

        {/* Limits & Tax */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Daily Spending Cap</Text>
            <View style={styles.inputRow}>
              <Text style={[styles.prefix, { color: theme.textSecondary }]}>{currency.symbol}</Text>
              <TextInput style={[styles.input, { color: theme.text }]} value={dailyCap} onChangeText={setDailyCap} keyboardType="number-pad" placeholder="0 = unlimited" placeholderTextColor={theme.textTertiary} />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Tax / VAT Rate</Text>
            <View style={styles.inputRow}>
              <TextInput style={[styles.input, { color: theme.text }]} value={tax} onChangeText={setTax} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={theme.textTertiary} />
              <Text style={[styles.suffix, { color: theme.textTertiary }]}>%</Text>
            </View>
          </View>
        </View>

        {/* User Activity */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.walletHeader}>
            <View style={[styles.walletIcon, { backgroundColor: '#8B5CF615' }]}>
              <Clock size={20} color="#8B5CF6" />
            </View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>User Activity</Text>
          </View>

          {/* Filter tabs */}
          <View style={[styles.adminTabBar, { backgroundColor: theme.surfaceAlt || theme.background }]}>
            {([
              { key: 'all', label: 'All' },
              { key: 'calls', label: 'Calls' },
              { key: 'topups', label: 'Top-Ups' },
            ] as const).map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[styles.adminTab, activityFilter === f.key && { backgroundColor: theme.accent + '15' }]}
                onPress={() => setActivityFilter(f.key)}
              >
                <Text style={[styles.adminTabLabel, { color: activityFilter === f.key ? theme.accent : theme.textTertiary }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {transactions.filter(t => activityFilter === 'all' || t.type === (activityFilter === 'calls' ? 'call' : 'topup')).length === 0 ? (
            <View style={styles.emptyActivity}>
              <Text style={[styles.emptyText, { color: theme.textTertiary }]}>No activity yet</Text>
            </View>
          ) : (
            transactions
              .filter(t => activityFilter === 'all' || t.type === (activityFilter === 'calls' ? 'call' : 'topup'))
              .map((tx, i) => {
                const isCall = tx.type === 'call';
                const isTopUp = tx.type === 'topup';
                const date = new Date(tx.date);
                const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <View
                    key={tx.id}
                    style={[
                      styles.activityItem,
                      i > 0 && { borderTopWidth: 1, borderTopColor: theme.border },
                    ]}
                  >
                    <View style={[styles.activityIcon, { backgroundColor: isCall ? '#EF444415' : '#10B98115' }]}>
                      {isCall ? <PhoneCall size={16} color="#EF4444" /> : <ArrowDownLeft size={16} color="#10B981" />}
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={[styles.activityDesc, { color: theme.text }]}>{tx.description}</Text>
                      <View style={styles.activityMeta}>
                        <Calendar size={11} color={theme.textTertiary} />
                        <Text style={[styles.activityDate, { color: theme.textTertiary }]}>{dateStr}</Text>
                        <Clock size={11} color={theme.textTertiary} />
                        <Text style={[styles.activityDate, { color: theme.textTertiary }]}>{timeStr}</Text>
                      </View>
                    </View>
                    <Text style={[styles.activityAmount, { color: isCall ? '#EF4444' : '#10B981' }]}>
                      {isCall ? '-' : '+'}{currency.symbol}{tx.amount}
                    </Text>
                  </View>
                );
              })
          )}
        </View>

        {/* Save */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: hasChanges ? theme.accent : theme.accent + '50' }]}
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={!hasChanges || confirming}
        >
          {confirming ? (
            <><RefreshCw size={20} color="#FFFFFF" /><Text style={styles.saveText}>Applying...</Text></>
          ) : saved ? (
            <><Check size={20} color="#FFFFFF" /><Text style={styles.saveText}>Saved!</Text></>
          ) : (
            <><Save size={20} color="#FFFFFF" /><Text style={styles.saveText}>Save Settings</Text></>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 },
  back: { width: 40, height: 40, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800' },
  card: { borderRadius: 20, marginBottom: 16, overflow: 'hidden' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  inputGroup: { padding: 16 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  hint: { fontSize: 12, marginTop: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  prefix: { fontSize: 20, fontWeight: '700', marginRight: 6 },
  input: { fontSize: 20, fontWeight: '700', padding: 0, flex: 1 },
  suffix: { fontSize: 14, fontWeight: '600', marginLeft: 6 },
  perSec: { fontSize: 13, fontWeight: '600', marginTop: 4, opacity: 0.7 },
  divider: { height: 1, marginHorizontal: 16 },
  walletHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  walletIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  walletLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  walletBalance: { fontSize: 26, fontWeight: '800', marginTop: 2 },
  cardTitle: { fontSize: 17, fontWeight: '700' },
  emptyActivity: { alignItems: 'center', padding: 24 },
  emptyText: { fontSize: 14, fontWeight: '500' },
  activityItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  activityIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  activityInfo: { flex: 1 },
  activityDesc: { fontSize: 14, fontWeight: '600', marginBottom: 3 },
  activityMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  activityDate: { fontSize: 11, fontWeight: '500' },
  activityAmount: { fontSize: 16, fontWeight: '700' },
  adminTabBar: { flexDirection: 'row', marginHorizontal: 12, marginTop: 8, borderRadius: 12, padding: 3, gap: 3 },
  adminTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, borderRadius: 10 },
  adminTabLabel: { fontSize: 12, fontWeight: '700' },
  adminInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10 },
  adminRecipientInput: { flex: 1, fontSize: 16, fontWeight: '600', padding: 0 },
  topUpRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  topUpInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderRadius: 14, height: 48 },
  topUpInput: { fontSize: 18, fontWeight: '700', padding: 0, flex: 1 },
  topUpBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, borderRadius: 14, height: 48 },
  topUpBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 16, boxShadow: '0 4px 8px rgba(0,0,0,0.15)', elevation: 4 },
  saveText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
