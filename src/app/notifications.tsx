import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Surface, Divider, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { router, Stack } from 'expo-router';

const MOCK_ALERTS = [
  {
    id: '1',
    type: 'warning',
    title: 'Rendimiento bajo el promedio',
    message: 'La campaña #942 en Horno 1 ha caído a 82.5% en la última hora.',
    time: 'Hace 15 min',
    icon: 'chart-bell-curve-cumulative',
  },
  {
    id: '2',
    type: 'error',
    title: 'Parada de producción detectada',
    message: 'Se ha detectado inactividad prolongada en Horno 4 (Grober Tech).',
    time: 'Hace 42 min',
    icon: 'alert-octagon',
  },
  {
    id: '3',
    type: 'success',
    title: 'Campaña finalizada con éxito',
    message: 'Campaña #938 completada con rendimiento promedio de 97.2%.',
    time: 'Hace 2 horas',
    icon: 'check-circle-outline',
  },
  {
    id: '4',
    type: 'info',
    title: 'Nueva campaña iniciada',
    message: 'El operador Juan Pérez inició la campaña #945 en Horno 2.',
    time: 'Hace 4 horas',
    icon: 'information-outline',
  },
];

export default function NotificationsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning': return { color: '#e9730c', bg: '#e9730c12' };
      case 'error': return { color: c.error, bg: c.error + '12' };
      case 'success': return { color: c.success, bg: c.success + '12' };
      default: return { color: c.primary, bg: c.primary + '12' };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      <Stack.Screen options={{ 
        headerShown: false,
        presentation: 'modal'
      }} />

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="close" size={24} color={c.text} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={[styles.title, { color: c.text }]}>Alertas y Notificaciones</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>Eventos recientes del sistema</Text>
        </View>
        <IconButton icon="dots-vertical" size={20} onPress={() => {}} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={false} tintColor={c.primary} />}
        contentContainerStyle={styles.list}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>HOY</Text>
        </View>

        {MOCK_ALERTS.map((alert) => {
          const st = getTypeStyles(alert.type);
          return (
            <Surface key={alert.id} style={[styles.alertCard, { backgroundColor: c.surface }]}>
              <View style={[styles.alertIcon, { backgroundColor: st.bg }]}>
                <MaterialCommunityIcons name={alert.icon as any} size={22} color={st.color} />
              </View>
              <View style={styles.alertContent}>
                <View style={styles.alertTop}>
                  <Text style={[styles.alertTitle, { color: c.text }]}>{alert.title}</Text>
                  <Text style={[styles.alertTime, { color: c.textMuted }]}>{alert.time}</Text>
                </View>
                <Text style={[styles.alertMessage, { color: c.textSecondary }]}>{alert.message}</Text>
              </View>
            </Surface>
          );
        })}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>AYER</Text>
        </View>
        <View style={styles.emptyPast}>
          <Text style={{ color: c.textMuted, fontSize: FontSize.xs }}>No hay más alertas recientes</Text>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: { flex: 1 },
  title: { fontSize: FontSize.lg, fontWeight: '700' },
  subtitle: { fontSize: FontSize.xs, fontWeight: '500', marginTop: 2 },
  list: { paddingTop: Spacing.sm },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  alertCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: { flex: 1 },
  alertTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: FontSize.base,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  alertTime: {
    fontSize: 10,
    fontWeight: '500',
  },
  alertMessage: {
    fontSize: FontSize.xs,
    lineHeight: 16,
    fontWeight: '400',
  },
  emptyPast: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
});
