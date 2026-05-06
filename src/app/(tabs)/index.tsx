import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text, Surface, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing } from '@/constants/theme';
import { useCompanies } from '@/features/admin/hooks/useCompanies';
import { useAuthStore } from '@/infrastructure/store/auth-store';
import { AppHeader } from '@/components/ui/app-header';
import { styles } from './index.styles';

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const user = useAuthStore((s) => s.user);
  const { data: companies, isLoading, refetch, isRefetching } = useCompanies();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <StatusBar style="light" />
      <AppHeader
        title={`${greeting()}, ${user?.name?.split(' ')[0] ?? 'Admin'}`}
        subtitle="GESTIÓN GROBER · PANEL ADMIN"
        dark
        actions={[
          {
            icon: 'bell-outline',
            onPress: () => router.push('/notifications'),
          },
        ]}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={c.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerStripContainer, { backgroundColor: c.primary }]}>
          <View style={styles.headerStrip}>
            {[...Array(6)].map((_, i) => (
              <View key={i} style={[styles.stripBar, { opacity: 0.15 + i * 0.04 }]} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>ACCESO RÁPIDO</Text>
          <View style={styles.quickGrid}>
            <QuickButton
              icon="domain"
              label="Empresas"
              color={c.primary}
              bg={c.primary + '12'}
              onPress={() => router.push('/companies')}
              c={c}
            />
            <QuickButton
              icon="chart-line"
              label="Rendimiento"
              color={c.success}
              bg={c.success + '12'}
              onPress={() => router.push('/campaigns')}
              c={c}
            />
            <QuickButton
              icon="account-circle-outline"
              label="Mi perfil"
              color="#9b59b6"
              bg={'#9b59b6' + '12'}
              onPress={() => router.push('/profile')}
              c={c}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>EMPRESAS</Text>
            <TouchableOpacity onPress={() => router.push('/companies')}>
              <Text style={[styles.seeAll, { color: c.primary }]}>Ver todas →</Text>
            </TouchableOpacity>
          </View>

          {companies?.slice(0, 3).map((co) => (
            <Link
              key={co.id}
              href={{ pathname: '/companies/[companyId]', params: { companyId: co.id } }}
              asChild
            >
              <TouchableOpacity activeOpacity={0.85}>
                <Surface style={[styles.previewCard, { backgroundColor: c.surface }]}>
                  <View style={[styles.previewDot, { backgroundColor: c.primary }]} />
                  <Text style={[styles.previewName, { color: c.text }]} numberOfLines={1}>
                    {co.name}
                  </Text>
                  <Text style={[styles.previewMeta, { color: c.textMuted }]}>
                    {co.machinesCount ?? '—'} hornos
                  </Text>
                  <MaterialCommunityIcons name="chevron-right" size={18} color={c.textMuted} />
                </Surface>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

function QuickButton({
  icon, label, color, bg, onPress, c,
}: {
  icon: string; label: string; color: string; bg: string; onPress: () => void; c: any;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ flex: 1 }}>
      <Surface style={[styles.quickCard, { backgroundColor: c.surface }]}>
        <View style={[styles.quickIcon, { backgroundColor: bg }]}>
          <MaterialCommunityIcons name={icon as any} size={22} color={color} />
        </View>
        <Text style={[styles.quickLabel, { color: c.textSecondary }]}>{label}</Text>
      </Surface>
    </TouchableOpacity>
  );
}
