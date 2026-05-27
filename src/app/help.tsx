import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Send,
  Bot,
  User,
  CircleHelp as HelpCircle,
  Trash2,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  time: string;
}

const now = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

function parseBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <Text key={i} style={{ fontWeight: '700' }}>{part.slice(2, -2)}</Text>;
    }
    return <Text key={i}>{part}</Text>;
  });
}

interface Suggestion {
  label: string;
  topic: string;
}

function getSuggestions(input: string): Suggestion[] {
  const lower = input.toLowerCase();
  if (lower.includes('call') || lower.includes('phone')) {
    return [
      { label: 'Add a contact', topic: 'add contact' },
      { label: 'Keypad tones', topic: 'tones' },
      { label: 'Speaker & mute', topic: 'speaker' },
    ];
  }
  if (lower.includes('contact') || lower.includes('add') || lower.includes('save')) {
    return [
      { label: 'Make a call', topic: 'call' },
      { label: 'Delete a contact', topic: 'delete contact' },
    ];
  }
  if (lower.includes('gateway') || lower.includes('device')) {
    return [
      { label: 'Troubleshooting', topic: 'troubleshooting' },
      { label: 'Dark mode', topic: 'dark mode' },
    ];
  }
  if (lower.includes('trouble') || lower.includes('issue') || lower.includes('not work')) {
    return [
      { label: 'Contact support', topic: 'support' },
      { label: 'Smart Gateway', topic: 'gateway' },
    ];
  }
  if (lower.includes('dark') || lower.includes('theme')) {
    return [
      { label: 'Appearance settings', topic: 'appearance' },
      { label: 'Privacy', topic: 'privacy' },
    ];
  }
  if (lower.includes('hello') || lower.includes('hi')) {
    return [
      { label: 'Make a call', topic: 'call' },
      { label: 'Add a contact', topic: 'add contact' },
      { label: 'Troubleshooting', topic: 'troubleshooting' },
    ];
  }
  return [
    { label: 'Make a call', topic: 'call' },
    { label: 'Add a contact', topic: 'add contact' },
    { label: 'Smart Gateway', topic: 'gateway' },
  ];
}

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('call') || lower.includes('phone') || lower.includes('dial')) {
    return 'To make a call:\n\n1. Go to the **Keypad** tab (center button)\n2. Dial the number using the keypad\n3. Press the green call button\n\nYou can also tap a contact from **Contacts** or tap a recent call from **Calls** to call them directly.';
  }

  if (lower.includes('contact') || lower.includes('add') || lower.includes('save')) {
    return 'To add a contact:\n\n1. Go to the **Keypad** tab\n2. Dial the number\n3. Tap the **+** icon above the call button\n4. Enter a name and tap **Save**\n\nThe contact will appear in your **Contacts** tab.';
  }

  if (lower.includes('delete') || lower.includes('remove') || lower.includes('edit contact')) {
    return 'Contact management is coming soon! For now, contacts are stored per session. Restarting the app will clear custom contacts.\n\nWe\'re working on persistent storage for a future update.';
  }

  if (lower.includes('gateway') || lower.includes('smart') || lower.includes('device')) {
    return 'The **Smart Gateway** is your home\'s central hub. It connects all your devices and manages communications.\n\nFrom the Home screen you can see:\n• **6** connected devices\n• **24°C** indoor temperature\n• **3** active devices\n\nMore device controls and automation coming soon!';
  }

  if (lower.includes('trouble') || lower.includes('issue') || lower.includes('not work') || lower.includes('problem') || lower.includes('error') || lower.includes('fix')) {
    return 'Common troubleshooting tips:\n\n• **No sound?** Check device volume and microphone permissions\n• **Call not connecting?** Ensure your Smart Gateway is online (check home screen)\n• **App crashes?** Try clearing Metro cache with `npx expo start --clear`\n• **Dark mode resets?** Theme resets on app restart — persistence coming\n• **Can\'t hear tones?** The app needs a native rebuild for audio. Run `npx expo run:android`\n\nStill having issues? Tap **Contact support** below.';
  }

  if (lower.includes('dark') || lower.includes('theme') || lower.includes('mode') || lower.includes('appearance')) {
    return 'To toggle dark mode:\n\n1. Go to **Settings**\n2. Find the **Dark Mode** toggle under Quick Settings\n3. Flip it on/off\n\nThe change applies immediately across all screens — no restart needed!';
  }

  if (lower.includes('privacy') || lower.includes('secure') || lower.includes('encrypt') || lower.includes('data')) {
    return 'Your privacy matters:\n\n• **End-to-end encryption** for all calls\n• **No data stored** on external servers\n• **Microphone access** only during active calls\n• **Contacts stay** on your device only\n\nSee Settings > Privacy & Security for more details.';
  }

  if (lower.includes('profile') || lower.includes('account') || lower.includes('name') || lower.includes('email')) {
    return 'Your profile is shown on the **Settings** screen. Currently the profile is a demo — custom profiles with photos and editable info are coming in a future update.\n\nYou can change your display name and avatar once profile editing launches!';
  }

  if (lower.includes('tone') || lower.includes('sound') || lower.includes('dtmf') || lower.includes('keypad sound')) {
    return 'Keypad tones and call sounds are generated in real-time by the app:\n\n• **DTMF tones** play when you press keypad buttons\n• **Ringtone** plays when you initiate a call\n• **End tone** plays when you hang up\n\nNote: These need a native dev build to work. Run `npx expo run:android` to enable them.';
  }

  if (lower.includes('speaker') || lower.includes('mute') || lower.includes('microphone') || lower.includes('audio')) {
    return 'During an active call you can:\n\n• **Mute** — tap the microphone button to mute/unmute\n• **Speaker** — tap the speaker button to toggle between earpiece and speakerphone\n\nBoth controls are on the **active call screen**.';
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('good morning') || lower.includes('good evening')) {
    return 'Hello! 👋 I\'m your **Talk2Home Assistant**. I can help you with:\n\n• Making & receiving calls\n• Managing contacts\n• Smart Gateway info\n• Troubleshooting\n• Dark mode & settings\n• Privacy & security\n\nWhat would you like to know?';
  }

  if (lower.includes('thank') || lower.includes('thanks')) {
    return 'You\'re welcome! 😊 Happy to help. If you think of anything else, just type away!';
  }

  if (lower.includes('bye') || lower.includes('goodbye')) {
    return 'Goodbye! 👋 Feel free to come back anytime you need help. Have a great day!';
  }

  if (lower.includes('support') || lower.includes('contact support') || lower.includes('human') || lower.includes('agent')) {
    return 'Our support team is available:\n\n• **Email:** support@talk2home.app\n• **Response time:** Within 24 hours\n\nFor now, I can help answer most questions about the app. What\'s on your mind?';
  }

  return 'I\'m not sure I understand that yet. Try asking about:\n\n• Making calls\n• Adding contacts\n• Smart Gateway\n• Troubleshooting\n• Dark mode\n• Privacy & security\n• Keypad tones\n\nOr pick a suggestion below! 👇';
}

function TypingDots() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(dot, {
            toValue: 1,
            duration: 320,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 320,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={{ flexDirection: 'row', gap: 5, paddingVertical: 4, paddingHorizontal: 4 }}>
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#94A3B8',
            opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
            transform: [{
              scale: dot.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }),
            }],
          }}
        />
      ))}
    </View>
  );
}

export default function HelpScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'bot',
      text: 'Hi! I\'m your **Talk2Home Assistant**. Ask me anything about the app, or pick a question below to get started.',
      time: now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down' | null>>({});
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    { label: 'Make a call', topic: 'call' },
    { label: 'Add a contact', topic: 'add contact' },
    { label: 'Smart Gateway', topic: 'gateway' },
    { label: 'Troubleshooting', topic: 'troubleshooting' },
  ]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: false });
  }, []);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setSuggestions([]);

    setTimeout(() => {
      const reply = getBotResponse(trimmed);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: reply,
        time: now(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      setSuggestions(getSuggestions(trimmed));
    }, 800);
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'bot',
        text: 'Chat cleared. How can I help you?',
        time: now(),
      },
    ]);
    setSuggestions([
      { label: 'Make a call', topic: 'call' },
      { label: 'Add a contact', topic: 'add contact' },
      { label: 'Smart Gateway', topic: 'gateway' },
      { label: 'Troubleshooting', topic: 'troubleshooting' },
    ]);
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedback((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isBot = item.role === 'bot';
    const fb = feedback[item.id];
    const showFeedback = isBot && item.id !== messages[0]?.id;
    return (
      <View style={[styles.messageRow, isBot ? styles.botRow : styles.userRow]}>
        {isBot && (
          <View style={[styles.avatar, { backgroundColor: theme.accent + '20' }]}>
            <Bot size={18} color={theme.accent} />
          </View>
        )}
        <View style={{ maxWidth: '75%' }}>
          <View
            style={[
              styles.bubble,
              isBot
                ? [styles.botBubble, { backgroundColor: theme.surface }]
                : [styles.userBubble, { backgroundColor: theme.accent }],
            ]}
          >
            <Text style={[styles.bubbleText, { color: isBot ? theme.text : '#FFFFFF' }]}>
              {parseBold(item.text)}
            </Text>
          </View>
          <View style={styles.messageMeta}>
            <Text style={[styles.timeText, { color: theme.textTertiary, textAlign: isBot ? 'left' : 'right' }]}>
              {item.time}
            </Text>
            {showFeedback && (
              <View style={styles.feedbackRow}>
                <TouchableOpacity
                  onPress={() => handleFeedback(item.id, 'up')}
                  style={[styles.feedbackBtn, fb === 'up' && { backgroundColor: theme.accent + '20' }]}
                >
                  <ThumbsUp size={13} color={fb === 'up' ? theme.accent : theme.textTertiary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleFeedback(item.id, 'down')}
                  style={[styles.feedbackBtn, fb === 'down' && { backgroundColor: '#EF444420' }]}
                >
                  <ThumbsDown size={13} color={fb === 'down' ? '#EF4444' : theme.textTertiary} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        {!isBot && (
          <View style={[styles.avatar, { backgroundColor: theme.accent + '30' }]}>
            <User size={18} color={theme.accent} />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.surface }]} onPress={() => router.back()}>
            <HelpCircle size={22} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Help & Support</Text>
            <Text style={[styles.headerSub, { color: theme.textTertiary }]}>
              {isTyping ? 'Typing...' : 'Online'}
            </Text>
          </View>
          <TouchableOpacity style={[styles.clearBtn, { backgroundColor: theme.surface }]} onPress={handleClear}>
            <Trash2 size={18} color={theme.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            <View style={styles.footer}>
              {isTyping && (
                <View style={[styles.messageRow, styles.botRow]}>
                  <View style={[styles.avatar, { backgroundColor: theme.accent + '20' }]}>
                    <Bot size={18} color={theme.accent} />
                  </View>
                  <View style={[styles.bubble, styles.botBubble, { backgroundColor: theme.surface }]}>
                    <TypingDots />
                  </View>
                </View>
              )}
              {suggestions.length > 0 && !isTyping && (
                <View style={styles.suggestionsWrap}>
                  <View style={styles.suggestionsHeader}>
                    <Sparkles size={14} color={theme.accent} />
                    <Text style={[styles.suggestionsLabel, { color: theme.textTertiary }]}>Try asking</Text>
                  </View>
                  <View style={styles.quickRow}>
                    {suggestions.map((s, i) => (
                      <TouchableOpacity
                        key={i}
                        style={[styles.quickChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => sendMessage(s.topic)}
                      >
                        <Text style={[styles.quickText, { color: theme.textSecondary }]}>{s.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          }
        />

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
            placeholder="Ask a question..."
            placeholderTextColor={theme.textTertiary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: input.trim() ? theme.accent : theme.border }]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
          >
            <Send size={20} color={input.trim() ? '#FFFFFF' : theme.textTertiary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  clearBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  footer: {
    gap: 4,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginHorizontal: 4,
    gap: 8,
  },
  timeText: {
    fontSize: 11,
  },
  feedbackRow: {
    flexDirection: 'row',
    gap: 4,
  },
  feedbackBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsWrap: {
    marginTop: 8,
    marginLeft: 48,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  suggestionsLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  quickText: {
    fontSize: 13,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 18,
    fontSize: 15,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
