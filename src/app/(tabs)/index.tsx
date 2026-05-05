import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text, Surface, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Link } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useCompanies } from '@/features/admin/hooks/useCompanies';
import { useAuthStore } from '@/infrastructure/store/auth-store';
import { StatKpiCard } from '@/components/stat-kpi-card';

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const user = useAuthStore((s) => s.user);
  const { data: companies, isLoading, refetch, isRefetching } = useCompanies();

  const totalMachines = companies?.reduce((acc, co) => acc + (co.machinesCount ?? 0), 0) ?? 0;
  const totalActiveCampaigns = companies?.reduce((acc, co) => acc + (co.activeCampaignsCount ?? 0), 0) ?? 0;
  const totalCompanies = companies?.length ?? 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={c.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={[styles.header, { backgroundColor: c.primary }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{greeting()},</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.name ?? 'Administrador'}
              </Text>
              <Text style={styles.headerSubtitle}>GESTIÓN GROBER · PANEL ADMIN</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              <TouchableOpacity
                style={styles.headerIcon}
                activeOpacity={0.7}
                onPress={() => router.push('/notifications')}
              >
                <MaterialCommunityIcons name="bell-outline" size={24} color="#ffffff" />
                <View style={[styles.alertDot, { backgroundColor: c.error }]} />
              </TouchableOpacity>
              <View style={styles.headerIcon}>
                <MaterialCommunityIcons name="shield-check" size={24} color="rgba(255,255,255,0.9)" />
              </View>
            </View>
          </View>

          {/* Decoration strip */}
          <View style={styles.headerStrip}>
            {[...Array(6)].map((_, i) => (
              <View key={i} style={[styles.stripBar, { opacity: 0.15 + i * 0.04 }]} />
            ))}
          </View>
        </View>

        {/* ── Quick access ── */}
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

        {/* ── Company preview list ── */}
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
    </SafeAreaView>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FontSize.sm,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  userName: {
    color: '#ffffff',
    fontSize: FontSize.xl,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 6,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  alertDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  headerStrip: {
    flexDirection: 'row',
    gap: 4,
    marginTop: Spacing.lg,
  },
  stripBar: {
    flex: 1,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  seeAll: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    gap: Spacing.sm,
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  previewName: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  previewMeta: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
});
