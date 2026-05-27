import { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Shield,
  Wifi,
  CircleHelp as HelpCircle,
  ChevronRight,
  LogOut,
  Moon,
  Bell,
  User,
  Mail,
  Phone,
  FileText,
  Check,
  Lock,
  X,
  Wallet,
} from 'lucide-react-native';

import { useRouter } from 'expo-router';
import { Header } from '../../components/Header';
import { LinearGradient } from '../../components/LinearGradient';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

const settingsSections = [
  {
    title: 'Account',
    items: [
      { icon: Wallet, label: 'Wallet', color: '#10B981' },
      { icon: Shield, label: 'Privacy & Security', color: '#8B5CF6' },
    ],
  },
  {
    title: 'System',
    items: [
      { icon: Wifi, label: 'Network & Devices', color: '#268EBA' },
      { icon: HelpCircle, label: 'Help & Support', color: '#6366F1' },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser } = useUser();
  const [notifications, setNotifications] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editBio, setEditBio] = useState(user.bio);

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSaveProfile = () => {
    updateUser({ name: editName, email: editEmail, phone: editPhone, bio: editBio });
    setEditing(false);
  };

  const handleCancelProfile = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditBio(user.bio);
    setEditing(false);
  };

  const [tapCount, setTapCount] = useState(0);
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ADMIN_PASSCODE = '1234';

  const handleVersionTap = () => {
    const next = tapCount + 1;
    setTapCount(next);
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (next >= 7) {
      setTapCount(0);
      setPasscodeInput('');
      setPasscodeError(false);
      setShowPasscode(true);
    } else {
      tapTimer.current = setTimeout(() => setTapCount(0), 2000);
    }
  };

  const handlePasscodeSubmit = () => {
    if (passcodeInput === ADMIN_PASSCODE) {
      setShowPasscode(false);
      setPasscodeInput('');
      router.push('/admin');
    } else {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 1500);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header title="Settings" showBack />

        {/* Profile Card / Inline Editor */}
        {!editing ? (
          <TouchableOpacity
            style={[styles.profileCard, { backgroundColor: theme.surface }]}
            activeOpacity={0.7}
            onPress={() => setEditing(true)}
          >
            <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.profileAvatar}>
              <Text style={styles.profileInitials}>{initials}</Text>
            </LinearGradient>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>{user.name}</Text>
              <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{user.email}</Text>
            </View>
            <ChevronRight size={20} color={theme.textTertiary} />
          </TouchableOpacity>
        ) : (
          <View style={[styles.editCard, { backgroundColor: theme.surface }]}>
            <View style={styles.editCardHeader}>
              <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.editAvatar}>
                <Text style={styles.editAvatarText}>{initials}</Text>
              </LinearGradient>
              <Text style={[styles.editTitle, { color: theme.text }]}>Edit Profile</Text>
            </View>

            <View style={styles.editField}>
              <View style={[styles.editIcon, { backgroundColor: theme.accent + '15' }]}>
                <User size={16} color={theme.accent} />
              </View>
              <TextInput
                style={[styles.editInput, { color: theme.text }]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Full Name"
                placeholderTextColor={theme.textTertiary}
              />
            </View>

            <View style={[styles.editDivider, { backgroundColor: theme.border }]} />

            <View style={styles.editField}>
              <View style={[styles.editIcon, { backgroundColor: '#F59E0B15' }]}>
                <Mail size={16} color="#F59E0B" />
              </View>
              <TextInput
                style={[styles.editInput, { color: theme.text }]}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Email"
                placeholderTextColor={theme.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.editDivider, { backgroundColor: theme.border }]} />

            <View style={styles.editField}>
              <View style={[styles.editIcon, { backgroundColor: '#10B98115' }]}>
                <Phone size={16} color="#10B981" />
              </View>
              <TextInput
                style={[styles.editInput, { color: theme.text }]}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="Phone"
                placeholderTextColor={theme.textTertiary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={[styles.editDivider, { backgroundColor: theme.border }]} />

            <View style={styles.editField}>
              <View style={[styles.editIcon, { backgroundColor: '#8B5CF615' }]}>
                <FileText size={16} color="#8B5CF6" />
              </View>
              <TextInput
                style={[styles.editInput, { color: theme.text }]}
                value={editBio}
                onChangeText={setEditBio}
                placeholder="Bio"
                placeholderTextColor={theme.textTertiary}
              />
            </View>

            <View style={styles.editActions}>
              <TouchableOpacity style={[styles.editCancelBtn, { backgroundColor: theme.border }]} onPress={handleCancelProfile}>
                <Text style={[styles.editCancelText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.editSaveBtn, { backgroundColor: theme.accent }]} onPress={handleSaveProfile}>
                <Check size={18} color="#FFFFFF" />
                <Text style={styles.editSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quick Settings */}
        <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>Quick Settings</Text>
        <View style={[styles.toggleCard, { backgroundColor: theme.surface }]}>
          <View style={styles.toggleRow}>
            <View style={[styles.toggleIcon, { backgroundColor: theme.accent + '20' }]}>
              <Moon size={20} color={theme.accent} />
            </View>
            <Text style={[styles.toggleLabel, { color: theme.text }]}>Dark Mode</Text>
            <Switch
              value={theme.isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: theme.accent + '60' }}
              thumbColor={theme.isDark ? theme.accent : '#F1F5F9'}
            />
          </View>
          <View style={[styles.toggleDivider, { backgroundColor: theme.border }]} />
          <View style={styles.toggleRow}>
            <View style={[styles.toggleIcon, { backgroundColor: '#F59E0B20' }]}>
              <Bell size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.toggleLabel, { color: theme.text }]}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#CBD5E1', true: '#F59E0B60' }}
              thumbColor={notifications ? '#F59E0B' : '#F1F5F9'}
            />
          </View>
        </View>

        {settingsSections.map((section, sIndex) => (
          <View key={sIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>{section.title}</Text>
            <View style={[styles.sectionCard, { backgroundColor: theme.surface }]}>
              {section.items.map((item, iIndex) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={iIndex}
                    style={[
                      styles.settingsItem,
                      iIndex < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (item.label === 'Help & Support') {
                        router.push('/help');
                      } else if (item.label === 'Wallet') {
                        router.push('/wallet');
                      }
                    }}
                  >
                    <View style={[styles.settingsIcon, { backgroundColor: item.color + '15' }]}>
                      <Icon size={18} color={item.color} />
                    </View>
                    <Text style={[styles.settingsLabel, { color: theme.text }]}>{item.label}</Text>
                    <ChevronRight size={18} color={theme.textTertiary} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme.dangerBg, borderColor: theme.dangerBorder }]} activeOpacity={0.7}>
          <View style={[styles.logoutIcon, { backgroundColor: theme.dangerBorder }]}>
            <LogOut size={18} color={theme.danger} />
          </View>
          <Text style={[styles.logoutText, { color: theme.danger }]}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleVersionTap} activeOpacity={1}>
          <Text style={[styles.version, { color: theme.textTertiary }]}>Talk2Home v1.0.0</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Passcode Modal */}
      <Modal visible={showPasscode} transparent animationType="fade" onRequestClose={() => setShowPasscode(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.passcodeModal, { backgroundColor: theme.surface }]}>
            <TouchableOpacity style={styles.passcodeClose} onPress={() => { setShowPasscode(false); setPasscodeInput(''); }}>
              <X size={20} color={theme.textTertiary} />
            </TouchableOpacity>
            <View style={[styles.passcodeIconWrap, { backgroundColor: theme.accent + '15' }]}>
              <Lock size={28} color={theme.accent} />
            </View>
            <Text style={[styles.passcodeTitle, { color: theme.text }]}>Admin Access</Text>
            <Text style={[styles.passcodeSub, { color: theme.textTertiary }]}>Enter passcode to continue</Text>
            <TextInput
              style={[
                styles.passcodeInput,
                { backgroundColor: theme.surfaceAlt, color: theme.text, borderColor: passcodeError ? '#EF4444' : theme.border },
              ]}
              value={passcodeInput}
              onChangeText={(t) => { setPasscodeInput(t); setPasscodeError(false); }}
              placeholder="Passcode"
              placeholderTextColor={theme.textTertiary}
              keyboardType="number-pad"
              secureTextEntry
              maxLength= {6}
              autoFocus
            />
            {passcodeError && (
              <Text style={styles.passcodeErrorText}>Incorrect passcode</Text>
            )}
            <TouchableOpacity
              style={[styles.passcodeSubmit, { backgroundColor: theme.accent, opacity: passcodeInput.length === 0 ? 0.5 : 1 }]}
              onPress={handlePasscodeSubmit}
              disabled={passcodeInput.length === 0}
            >
              <Text style={styles.passcodeSubmitText}>Unlock</Text>
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
  },
  /* Profile Card */
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 22,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#268EBA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInitials: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 3,
  },
  profileEmail: {
    fontSize: 13,
  },
  /* Quick Settings Toggle Card */
  toggleCard: {
    borderRadius: 18,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  toggleLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  toggleDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  /* Sections */
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  /* Logout */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  logoutIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  /* Inline Edit Card */
  editCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  editCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  editAvatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#268EBA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  editField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  editIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    padding: 0,
  },
  editDivider: {
    height: 1,
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  editCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editCancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  editSaveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  editSaveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  /* Passcode Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passcodeModal: {
    width: '78%',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  passcodeClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passcodeIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  passcodeTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  passcodeSub: {
    fontSize: 14,
    marginBottom: 24,
  },
  passcodeInput: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 1,
    textAlign: 'center',
    letterSpacing: 4,
  },
  passcodeErrorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  passcodeSubmit: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  passcodeSubmitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
