import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';

export default function ProfileScreen() {
  const { student, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.screenTitle}>Profile</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {student?.student_name?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{student?.student_name || 'Student'}</Text>
        <Text style={styles.email}>{student?.email || ''}</Text>
        {student?.phone ? <Text style={styles.phone}>{student.phone}</Text> : null}
        <Text style={styles.studentId}>ID: {student?.student_id || 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Notifications</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>About</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>CampusOS v1.0.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  screenTitle: {
    fontSize: 28, fontWeight: '700', color: COLORS.text, letterSpacing: -0.5,
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.xl,
    alignItems: 'center', marginHorizontal: SPACING.lg, marginBottom: SPACING.xl,
    ...SHADOW,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary + '18',
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: COLORS.primary },
  name: { fontSize: 20, fontWeight: '600', color: COLORS.text },
  email: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  phone: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  studentId: { fontSize: 13, color: COLORS.textSecondary, marginTop: SPACING.sm },
  section: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, marginHorizontal: SPACING.lg,
    ...SHADOW,
  },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg,
  },
  menuText: { fontSize: 16, color: COLORS.text },
  chevron: { fontSize: 20, color: COLORS.textSecondary },
  separator: { height: 1, backgroundColor: COLORS.separator, marginLeft: SPACING.lg },
  logoutBtn: {
    marginHorizontal: SPACING.lg, marginTop: SPACING.xl,
    backgroundColor: COLORS.danger + '12', borderRadius: RADIUS.md,
    paddingVertical: SPACING.lg, alignItems: 'center',
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: COLORS.danger },
  version: { textAlign: 'center', color: COLORS.textSecondary, fontSize: 12, marginTop: SPACING.xl },
});
