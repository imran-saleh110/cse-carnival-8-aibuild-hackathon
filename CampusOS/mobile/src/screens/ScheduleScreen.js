import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

export default function ScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay()] || 'Sunday');
  const [schedule, setSchedule] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSchedule = async (day) => {
    try {
      const { data } = await api.get(`/schedules?day=${day}`);
      setSchedule(data);
    } catch {}
  };

  useEffect(() => { fetchSchedule(selectedDay); }, [selectedDay]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSchedule(selectedDay);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.screenTitle}>Schedule</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayBar}>
        {DAYS.map((day, i) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayPill, selectedDay === day && styles.dayPillActive]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.dayAbbr, selectedDay === day && styles.dayAbbrActive]}>
              {DAY_ABBR[i]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {schedule.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No classes on {selectedDay}</Text>
          </View>
        ) : (
          schedule.map((s) => (
            <View key={s.id} style={styles.card}>
              <View style={styles.timeCol}>
                <Text style={styles.startTime}>{s.start_time?.slice(0, 5)}</Text>
                <Text style={styles.endTime}>{s.end_time?.slice(0, 5)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoCol}>
                <Text style={styles.course}>{s.course}</Text>
                <Text style={styles.title}>{s.title}</Text>
                <Text style={styles.meta}>{s.room} · {s.section || 'All'} · {s.instructor || 'TBA'}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  screenTitle: {
    fontSize: 28, fontWeight: '700', color: COLORS.text, letterSpacing: -0.5,
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, marginBottom: SPACING.md,
  },
  dayBar: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg, maxHeight: 44 },
  dayPill: {
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    borderRadius: 20, backgroundColor: COLORS.card, marginRight: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.separator,
  },
  dayPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dayAbbr: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  dayAbbrActive: { color: COLORS.white },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl * 2 },
  card: {
    flexDirection: 'row', backgroundColor: COLORS.card,
    borderRadius: RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm,
    ...SHADOW,
  },
  timeCol: { alignItems: 'center', marginRight: SPACING.md, minWidth: 44 },
  startTime: { fontSize: 15, fontWeight: '600', color: COLORS.primary },
  endTime: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  divider: { width: 1, backgroundColor: COLORS.separator, marginRight: SPACING.lg },
  infoCol: { flex: 1 },
  course: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  title: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  meta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: SPACING.xxl * 2 },
  emptyText: { fontSize: 15, color: COLORS.textSecondary },
});
