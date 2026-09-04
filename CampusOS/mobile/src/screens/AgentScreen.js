import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';

const QUICK_ACTIONS = [
  "What's my next class?",
  "What's due this week?",
  "Is there a free room with a projector?",
  "Show me high priority announcements",
];

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAgent]}>
      {!isUser && <Text style={styles.agentLabel}>CampusOS</Text>}
      <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{message.text}</Text>
    </View>
  );
}

export default function AgentScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', text: text.trim() }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          text: 'AI agent is not connected yet. This is a placeholder response. The agent will be powered by an LLM with tool-calling capabilities that reads live campus data.',
        },
      ]);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>AI Agent</Text>
        <View style={styles.statusDot} />
      </View>

      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🤖</Text>
          <Text style={styles.emptyTitle}>Ask CampusOS anything</Text>
          <Text style={styles.emptySubtitle}>
            I can answer questions about your schedule, rooms, events, and more.
          </Text>
          <View style={styles.quickActions}>
            {QUICK_ACTIONS.map((q) => (
              <TouchableOpacity key={q} style={styles.quickPill} onPress={() => send(q)}>
                <Text style={styles.quickText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => <MessageBubble message={item} />}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Ask about schedules, rooms, events..."
            placeholderTextColor={COLORS.textSecondary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => send(input)}
            disabled={!input.trim()}
          >
            <Text style={styles.sendText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md, paddingBottom: SPACING.sm,
  },
  screenTitle: { fontSize: 28, fontWeight: '700', color: COLORS.text, letterSpacing: -0.5 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, marginLeft: SPACING.sm },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.xxl },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.lg },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl },
  quickActions: { gap: SPACING.sm, width: '100%' },
  quickPill: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.separator,
  },
  quickText: { fontSize: 14, color: COLORS.primary, fontWeight: '500' },
  messageList: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  bubble: {
    maxWidth: '80%', borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  bubbleUser: { backgroundColor: COLORS.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleAgent: { backgroundColor: COLORS.card, alignSelf: 'flex-start', borderBottomLeftRadius: 4, ...SHADOW },
  agentLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 4 },
  bubbleText: { fontSize: 15, color: COLORS.text, lineHeight: 20 },
  bubbleTextUser: { color: COLORS.white },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm, backgroundColor: COLORS.card,
    borderTopWidth: 1, borderTopColor: COLORS.separator,
  },
  input: {
    flex: 1, backgroundColor: COLORS.background, borderRadius: 24,
    paddingHorizontal: SPACING.lg, paddingVertical: 10, fontSize: 15,
    color: COLORS.text, marginRight: SPACING.sm,
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
});
