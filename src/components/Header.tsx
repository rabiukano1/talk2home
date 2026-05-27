import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from './LinearGradient';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showProfile?: boolean;
  showLogo?: boolean;
}

export function Header({ title, showBack, showProfile, showLogo = true }: HeaderProps) {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={[styles.header, { marginBottom: 24 }]}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.surface }]} onPress={() => router.back()}>
            <ArrowLeft size={22} color={theme.text} />
          </TouchableOpacity>
        ) : showLogo ? (
          <Image
            source={require('../../assets/images/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <View style={{ width: 40 }} />
        )}

        <View style={styles.textBlock}>
          <Text style={[styles.titleText, { color: theme.text }, showBack && { fontSize: 28 }]}>
            {title || 'Home'}
          </Text>
        </View>
      </View>

      {showProfile && (
        <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
          <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.profileBtn}>
            <Text style={styles.profileInitials}>HU</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textBlock: {},
  titleText: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
  },
  iconBtn: {
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
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#268EBA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  profileInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
