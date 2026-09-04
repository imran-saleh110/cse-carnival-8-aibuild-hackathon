import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';

const TYPES = ['All', 'Classroom', 'Lab', 'Seminar'];

export default function RoomsScreen() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const fetchRooms = async () => {
    try {
      const params = filter !== 'All' ? `?type=${filter.toLowerCase()}` : '';
      const { data } = await api.get(`/rooms${params}`);
      setRooms(data);
    } catch {}
  };

  useEffect(() => { fetchRooms(); }, [filter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  };

  const typeIcon = (type) => {
    if (type === 'lab') return '💻';
    if (type === 'seminar') return '🎤';
    return '🏫';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.screenTitle}>Rooms</Text>

      <View style={styles.filterBar}>
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.filterPill, filter === t && styles.filterPillActive]}
            onPress={() => setFilter(t)}
          >
            <Text style={[styles.filterText, filter === t && styles.filterTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.icon}>{typeIcon(item.type)}</Text>
            <View style={styles.cardBody}>
              <View style={styles.cardRow}>
                <Text style={styles.roomNumber}>{item.room_number}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'available' ? COLORS.success + '18' : COLORS.danger + '18' }]}>
                  <Text style={[styles.statusText, { color: item.status === 'available' ? COLORS.success : COLORS.danger }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.meta}>
                {item.type} · Floor {item.floor} · Capacity {item.capacity}
              </Text>
              {item.equipment?.length > 0 && (
                <View style={styles.equipRow}>
                  {item.equipment.map((eq) => (
                    <View key={eq} style={styles.equipBadge}>
                      <Text style={styles.equipText}>{eq}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
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
  filterBar: {
    flexDirection: 'row', paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg, gap: SPACING.sm,
  },
  filterPill: {
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    borderRadius: 20, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.separator,
  },
  filterPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 13, fontWeight: '500', color: COLORS.text },
  filterTextActive: { color: COLORS.white },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl * 2 },
  card: {
    flexDirection: 'row', backgroundColor: COLORS.card,
    borderRadius: RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm,
    ...SHADOW,
  },
  icon: { fontSize: 24, marginRight: SPACING.md, marginTop: 2 },
  cardBody: { flex: 1 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roomNumber: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  statusBadge: { borderRadius: 12, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  statusText: { fontSize: 11, fontWeight: '600' },
  meta: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  equipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.sm, gap: SPACING.xs },
  equipBadge: {
    backgroundColor: COLORS.background, borderRadius: 6,
    paddingHorizontal: SPACING.sm, paddingVertical: 2,
  },
  equipText: { fontSize: 11, color: COLORS.textSecondary },
});
