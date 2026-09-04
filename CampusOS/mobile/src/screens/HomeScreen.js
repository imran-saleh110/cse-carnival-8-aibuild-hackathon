import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

function getTodayName() {
  return DAYS[new Date().getDay()];
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function priorityColor(p) {
  if (p === 'high') return COLORS.highPriority;
  if (p === 'medium') return COLORS.mediumPriority;
  return COLORS.lowPriority;
}

function statusColor(s) {
  if (s === 'submitted' || s === 'graded') return COLORS.success;
  if (s === 'late') return COLORS.danger;
  return COLORS.warning;
}

export default function HomeScreen() {
  const { student } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const today = getTodayName();

  const fetchData = async () => {
    try {
      const [schRes, annRes, asgnRes] = await Promise.all([
        api.get(`/schedules?day=${today}`),
        api.get('/announcements'),
        api.get('/assignments'),
      ]);
      setSchedule(schRes.data);
      setAnnouncements(annRes.data.filter((a) => a.status === 'active'));
      setAssignments(asgnRes.data.filter((a) => a.status === 'pending' || a.status === 'late'));
    } catch {}
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>{getGreeting()},</Text>
          <Text style={styles.nameText}>{student?.student_name || 'Student'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          {schedule.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No classes today</Text>
            </View>
          ) : (
            schedule.map((s) => (
              <View key={s.id} style={styles.card}>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>{s.start_time?.slice(0, 5)}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{s.course}</Text>
                  <Text style={styles.cardSubtitle}>{s.title}</Text>
                  <Text style={styles.cardMeta}>{s.room} · {s.instructor || 'TBA'} · {s.section || ''}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
          {assignments.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No pending assignments</Text>
            </View>
          ) : (
            assignments.slice(0, 4).map((a) => (
              <View key={a.id} style={styles.card}>
                <View style={[styles.statusDot, { backgroundColor: statusColor(a.status) }]} />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{a.title}</Text>
                  <Text style={styles.cardSubtitle}>{a.course} · {a.course_title}</Text>
                  <Text style={styles.cardMeta}>Due: {a.deadline}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Announcements</Text>
          {announcements.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No active announcements</Text>
            </View>
          ) : (
            announcements.slice(0, 3).map((a) => (
              <View key={a.id} style={styles.card}>
                <View style={[styles.priorityBar, { backgroundColor: priorityColor(a.priority) }]} />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{a.title}</Text>
                  <Text style={styles.cardMeta}>{a.posted_by} · {a.date}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl * 2 },
  greeting: { marginBottom: SPACING.xl },
  greetingText: { fontSize: 15, color: COLORS.textSecondary },
  nameText: { fontSize: 28, fontWeight: '700', color: COLORS.text, letterSpacing: -0.5 },
  section: { marginBottom: SPACING.xl },
  sectionTitle: {
    fontSize: 13, fontWeight: '600', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.md,
  },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm,
    ...SHADOW,
  },
  timeBadge: {
    backgroundColor: COLORS.primary + '12', borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, marginRight: SPACING.md,
  },
  timeText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: SPACING.md },
  priorityBar: { width: 3, height: '80%', borderRadius: 2, marginRight: SPACING.md },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  cardSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  cardMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  emptyCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    padding: SPACING.xl, alignItems: 'center',
  },
  emptyText: { fontSize: 14, color: COLORS.textSecondary },
});
