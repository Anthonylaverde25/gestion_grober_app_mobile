import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text, ActivityIndicator, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Stack, Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useCompany, useCompanyMachines } from '@/features/admin/hooks/useCompanies';
import { MachineCard } from '@/components/machine-card';
import { Machine } from '@/core/domain/entities';

export default function CompanyDetailScreen() {
  const { companyId } = useLocalSearchParams<{ companyId: string }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const { data: company } = useCompany(companyId);
  const { data: machines, isLoading, refetch, isRefetching, error } = useCompanyMachines(companyId);

  const activeCount = machines?.filter((m) => m.status === 'active').length ?? 0;

  const renderItem = ({ item }: { item: Machine }) => (
    <Link
      href={{
        pathname: '/companies/[companyId]/machine/[machineId]',
        params: { companyId, machineId: item.id },
      }}
      asChild
    >
      <MachineCard machine={item} />
    </Link>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Custom Header ── */}
      <View style={[styles.header, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={c.text} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>
            {company?.name ?? 'Empresa'}
          </Text>
          {company?.country && (
            <View style={styles.countryRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={12} color={c.textSecondary} />
              <Text style={[styles.subtitle, { color: c.textSecondary }]}> {company.country}</Text>
            </View>
          )}
        </View>
        <View style={[styles.badge, { backgroundColor: activeCount > 0 ? c.success + '18' : c.textMuted + '18' }]}>
          <Text style={[styles.badgeText, { color: activeCount > 0 ? c.success : c.textMuted }]}>
            {activeCount} activos
          </Text>
        </View>
      </View>

      {/* ── Summary Strip ── */}
      <View style={[styles.strip, { backgroundColor: c.primary }]}>
        <View style={styles.stripItem}>
          <MaterialCommunityIcons name="fire" size={16} color="rgba(255,255,255,0.8)" />
          <Text style={styles.stripText}>{machines?.length ?? '—'} hornos</Text>
        </View>
        <View style={styles.stripDivider} />
        <View style={styles.stripItem}>
          <MaterialCommunityIcons name="factory" size={16} color="rgba(255,255,255,0.8)" />
          <Text style={styles.stripText}>{company?.activeCampaignsCount ?? '—'} campañas activas</Text>
        </View>
      </View>

      {/* ── Section label ── */}
      <View style={[styles.sectionHeader, { borderBottomColor: c.border }]}>
        <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>HORNOS / MÁQUINAS</Text>
      </View>

      {/* ── Content ── */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={c.primary} />
          <Text style={[styles.loadingText, { color: c.textMuted }]}>Cargando hornos...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="alert-circle-outline" size={40} color={c.error} />
          <Text style={[styles.errorText, { color: c.error }]}>Error al cargar los hornos</Text>
          <Text style={[styles.emptyText, { color: c.textMuted }]}>
            {(error as any)?.response?.data?.message
              ?? (error as any)?.message
              ?? 'Error desconocido'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={machines}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={c.primary} />
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialCommunityIcons name="fire-off" size={40} color={c.textMuted} />
              <Text style={[styles.emptyText, { color: c.textMuted }]}>
                Esta empresa no tiene hornos registrados
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  subtitle: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  strip: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
    alignItems: 'center',
  },
  stripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stripText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  stripDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  list: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    marginTop: Spacing.sm,
  },
  errorText: {
    fontSize: FontSize.base,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
