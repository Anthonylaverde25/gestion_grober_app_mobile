import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing } from '@/constants/theme';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppHeader } from '@/components/ui/app-header';
import { styles } from './notifications.styles';

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
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <StatusBar style="light" />
      <Stack.Screen options={{ 
        headerShown: false,
        presentation: 'modal'
      }} />

      <AppHeader
        title="Alertas y Notificaciones"
        subtitle="Eventos recientes del sistema"
        dark
        showBack
        onBack={() => router.back()}
        elevated={false}
      />

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
          <Text style={{ color: c.textMuted, fontSize: 10, fontWeight: '500' }}>No hay más alertas recientes</Text>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}
