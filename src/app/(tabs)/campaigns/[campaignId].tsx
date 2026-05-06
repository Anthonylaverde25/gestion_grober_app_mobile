import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text, ActivityIndicator, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useCampaignYields } from '@/features/admin/hooks/useCampaignYields';
import { YieldLineChart } from '@/components/yield-line-chart';
import { YieldRecordList } from '@/components/yield-record-list';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/infrastructure/api/axios-client';

interface ApiCampaignDetail {
  id: string;
  codigo: string;
  status: string;
  started_at: string;
  finished_at?: string | null;
  total_yield_records?: number;
  machine: { id: string; name: string };
  client: { id: string; name: string };
  article: { id: string; name: string };
}

function useCampaignDetail(campaignId: string) {
  return useQuery({
    queryKey: ['campaign-detail', campaignId],
    queryFn: async () => {
      const res = await axiosClient.get<{ data: ApiCampaignDetail }>(`/v1/mobile/campaigns/${campaignId}`);
      return res.data.data;
    },
    enabled: !!campaignId,
  });
}

function StatusBadge({ status, c }: { status: string; c: any }) {
  const isActive = status === 'open' || status === 'active';
  const bg = isActive ? c.success + '18' : c.textMuted + '18';
  const color = isActive ? c.success : c.textMuted;
  const label = isActive ? 'Activa' : 'Finalizada';

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: color }]} />
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export default function CampaignDetailScreen() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const { data: campaign, isLoading: loadingCampaign } = useCampaignDetail(campaignId);
  const { data: yields, isLoading: loadingYields, stats, refetch, isRefetching } = useCampaignYields(campaignId);

  const isLoading = loadingCampaign || loadingYields;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={c.text} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>
            Campaña #{campaign?.codigo ?? '...'}
          </Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]} numberOfLines={1}>
            {campaign?.machine?.name ?? 'Cargando...'} · {campaign?.article?.name ?? ''}
          </Text>
        </View>
        {campaign && <StatusBadge status={campaign.status} c={c} />}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={c.primary} />
          <Text style={[styles.loadingText, { color: c.textMuted }]}>Cargando rendimiento...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={c.primary} />
          }
        >
          {/* ── Campaign Info Strip ── */}
          <View style={[styles.infoStrip, { backgroundColor: c.primary }]}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="fire" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.infoText}>{campaign?.machine?.name ?? '—'}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="account-group-outline" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.infoText}>{campaign?.client?.name ?? '—'}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="clipboard-list-outline" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.infoText}>{yields?.length ?? 0} registros</Text>
            </View>
          </View>

          {/* ── KPI Summary ── */}
          {stats && (yields?.length ?? 0) > 0 && (
            <View style={styles.kpiRow}>
              <Surface style={[styles.kpiCard, { backgroundColor: c.surface }]}>
                <Text style={[styles.kpiLabel, { color: c.textMuted }]}>PROMEDIO</Text>
                <Text style={[styles.kpiValue, { color: c.primary }]}>{stats.average.toFixed(1)}%</Text>
              </Surface>
              <Surface style={[styles.kpiCard, { backgroundColor: c.surface }]}>
                <Text style={[styles.kpiLabel, { color: c.textMuted }]}>MÁXIMO</Text>
                <Text style={[styles.kpiValue, { color: c.success }]}>{stats.max.toFixed(1)}%</Text>
              </Surface>
              <Surface style={[styles.kpiCard, { backgroundColor: c.surface }]}>
                <Text style={[styles.kpiLabel, { color: c.textMuted }]}>MÍNIMO</Text>
                <Text style={[styles.kpiValue, { color: c.error }]}>{stats.min.toFixed(1)}%</Text>
              </Surface>
            </View>
          )}

          {/* ── Chart ── */}
          {(yields?.length ?? 0) > 0 && (
            <YieldLineChart
              records={yields ?? []}
              stats={stats}
              title="Tendencia de Rendimiento"
              onExpand={() => router.push({
                pathname: '/campaigns/[campaignId]/chart',
                params: { campaignId }
              })}
            />
          )}

          {/* ── Record list (timeline) ── */}
          <YieldRecordList 
            records={yields ?? []} 
            isLoading={loadingYields} 
            onExpand={() => router.push({
              pathname: '/campaigns/[campaignId]/yields',
              params: { campaignId }
            })}
          />

          <View style={{ height: Spacing.xxl * 2 }} />
        </ScrollView>
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
  backBtn: { padding: Spacing.xs },
  headerTitle: { flex: 1 },
  title: { fontSize: FontSize.lg, fontWeight: '700' },
  subtitle: { fontSize: FontSize.xs, fontWeight: '500', marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  infoStrip: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },
  infoText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    fontWeight: '600',
  },
  infoDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  kpiRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  kpiCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  kpiLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  kpiValue: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
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
});
