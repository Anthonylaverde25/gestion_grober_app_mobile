import React, { useState } from 'react';
import {
  View,
  SectionList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Text, ActivityIndicator, SegmentedButtons, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Link } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useQuery } from '@tanstack/react-query';
import { MachineRepository } from '@/infrastructure/api/repositories/MachineRepository';
import { CampaignCard } from '@/components/campaign-card';
import { Campaign } from '@/core/domain/entities';

export default function CampaignsListScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  const {
    data: campaigns,
    isLoading,
    refetch,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ['campaigns-list', filter],
    queryFn: () => {
      if (filter === 'active') {
        return MachineRepository.getActiveCampaigns();
      }
      return MachineRepository.getAllCampaigns();
    },
    staleTime: 1000 * 60 * 2,
  });

  const filtered = (campaigns ?? []).filter((ca) => {
    if (filter === 'all') return true;
    return ca.status === filter;
  });

  const activeCount = campaigns?.filter((c) => c.status === 'active').length ?? 0;
  const completedCount = campaigns?.filter((c) => c.status === 'completed').length ?? 0;

  // Grouping logic for Sections
  const sections = React.useMemo(() => {
    const groups: { [key: string]: Campaign[] } = {};
    filtered.forEach((ca) => {
      const coName = ca.companyName || 'Empresa Desconocida';
      if (!groups[coName]) groups[coName] = [];
      groups[coName].push(ca);
    });
    return Object.keys(groups).map((name) => ({
      title: name,
      data: groups[name],
    }));
  }, [filtered]);

  const renderItem = ({ item }: { item: Campaign }) => (
    <Link
      href={{
        pathname: '/campaigns/[campaignId]',
        params: { campaignId: item.id },
      }}
      asChild
    >
      <CampaignCard campaign={item} />
    </Link>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={[styles.sectionStickyHeader, { backgroundColor: c.background }]}>
      <View style={[styles.sectionBadge, { backgroundColor: c.primary + '15' }]}>
        <MaterialCommunityIcons name="domain" size={14} color={c.primary} />
        <Text style={[styles.sectionTitle, { color: c.primary }]}>{title.toUpperCase()}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      {/* ── Page Header ── */}
      <View style={[styles.pageHeader, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <View>
          <Text style={[styles.pageTitle, { color: c.text }]}>Campañas</Text>
          <Text style={[styles.pageSubtitle, { color: c.textMuted }]}>
            Gestión de rendimiento operativo
          </Text>
        </View>
        <View style={[styles.headerIcon, { backgroundColor: c.primary + '12' }]}>
          <MaterialCommunityIcons name="factory" size={22} color={c.primary} />
        </View>
      </View>

      {/* ── Stats strip ── */}
      <View style={[styles.statsStrip, { backgroundColor: c.primary }]}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{activeCount}</Text>
          <Text style={styles.statLabel}>Activas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completadas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{campaigns?.length ?? 0}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* ── Filter bar ── */}
      <View style={[styles.filterBar, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <SegmentedButtons
          value={filter}
          onValueChange={(v) => setFilter(v as typeof filter)}
          buttons={[
            { value: 'active', label: `Activas (${activeCount})` },
            { value: 'completed', label: 'Completadas' },
            { value: 'all', label: 'Todas' },
          ]}
          style={{ borderRadius: BorderRadius.sm }}
          theme={{
            colors: {
              secondaryContainer: c.primary + '20',
              onSecondaryContainer: c.primary,
            },
          }}
        />
      </View>

      {/* ── Content ── */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={c.primary} />
          <Text style={[styles.loadingText, { color: c.textMuted }]}>Cargando campañas...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="alert-circle-outline" size={40} color={c.error} />
          <Text style={[styles.errorText, { color: c.error }]}>Error al cargar campañas</Text>
          <Text style={[styles.errorSub, { color: c.textMuted }]}>
            {(error as any)?.response?.data?.message ?? (error as any)?.message ?? 'Error desconocido'}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={c.primary} />
          }
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>
                {filtered.length} CAMPAÑA{filtered.length !== 1 ? 'S' : ''} · AGRUPADAS POR EMPRESA
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialCommunityIcons name="factory" size={40} color={c.textMuted} />
              <Text style={[styles.emptyText, { color: c.textMuted }]}>
                {filter === 'active'
                  ? 'No hay campañas activas'
                  : 'No hay campañas registradas'}
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
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  pageTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  pageSubtitle: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsStrip: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#ffffff',
    fontSize: FontSize.lg,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginVertical: 2,
  },
  filterBar: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  list: {
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
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
    textAlign: 'center',
  },
  errorSub: {
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionStickyHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingTop: Spacing.md,
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
