import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Shield,
  Wifi,
  CircleUser,
  CircleHelp as HelpCircle,
  ChevronRight,
  LogOut,
  Moon,
  Bell,
} from 'lucide-react-native';

import { useRouter } from 'expo-router';
import { Header } from '../../components/Header';
import { LinearGradient } from '../../components/LinearGradient';
import { useTheme } from '../../context/ThemeContext';

const settingsSections = [
  {
    title: 'Account',
    items: [
      { icon: CircleUser, label: 'Profile', color: '#3B82F6' },
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
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header title="Settings" showBack />

        {/* Profile Card */}
        <TouchableOpacity style={[styles.profileCard, { backgroundColor: theme.surface }]} activeOpacity={0.7}>
          <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>HU</Text>
          </LinearGradient>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>Home User</Text>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>user@talk2home</Text>
          </View>
          <ChevronRight size={20} color={theme.textTertiary} />
        </TouchableOpacity>

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

        <Text style={[styles.version, { color: theme.textTertiary }]}>Talk2Home v1.0.0</Text>

        <View style={{ height: 60 }} />
      </ScrollView>
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
});
