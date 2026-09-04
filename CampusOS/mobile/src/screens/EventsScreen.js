import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';

const STATUS_COLORS = {
  upcoming: COLORS.primary,
  ongoing: COLORS.success,
  completed: COLORS.textSecondary,
  cancelled: COLORS.danger,
  full: COLORS.warning,
};

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch {}
  };

  useEffect(() => { fetchEvents(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.screenTitle}>Events</Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.eventName}>{item.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[item.status] || COLORS.primary) + '18' }]}>
                <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] || COLORS.primary }]}>
                  {item.status}
                </Text>
              </View>
            </View>
            {item.description ? (
              <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            ) : null}
            <View style={styles.metaRow}>
              <Text style={styles.meta}>📅 {item.start_date}</Text>
              <Text style={styles.meta}>📍 {item.venue}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>⏰ {item.start_time?.slice(0, 5)} – {item.end_time?.slice(0, 5)}</Text>
              <Text style={styles.meta}>👥 {item.registered}/{item.capacity}</Text>
            </View>
            <Text style={styles.organizer}>By {item.organizer}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  screenTitle: {
    fontSize: 28, fontWeight: '700', color: COLORS.text, letterSpacing: -0.5,
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, marginBottom: SPACING.md,
  },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl * 2 },
  card: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    padding: SPACING.lg, marginBottom: SPACING.sm, ...SHADOW,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  eventName: { fontSize: 16, fontWeight: '600', color: COLORS.text, flex: 1 },
  statusBadge: { borderRadius: 12, paddingHorizontal: SPACING.sm, paddingVertical: 2, marginLeft: SPACING.sm },
  statusText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  description: { fontSize: 13, color: COLORS.textSecondary, marginTop: SPACING.sm },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm },
  meta: { fontSize: 12, color: COLORS.textSecondary },
  organizer: { fontSize: 12, color: COLORS.textSecondary, marginTop: SPACING.sm, fontStyle: 'italic' },
});
