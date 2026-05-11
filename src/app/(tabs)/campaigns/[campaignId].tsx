import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Surface } from 'react-native-paper';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing } from '@/constants/theme';
import { useCampaignYieldSummary } from '@/features/admin/hooks/useCampaignYieldSummary';
import { YieldLineChart } from '@/components/yield-line-chart';
import { YieldChartSkeleton } from '@/components/yield-chart-skeleton';
import { YieldRecordList } from '@/components/yield-record-list';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/infrastructure/api/axios-client';
import { AppHeader } from '@/components/ui/app-header';
import { StatusBar } from 'expo-status-bar';
import { styles } from './[campaignId].styles';

// ── Campaign detail API shape ─────────────────────────────────────────────────
interface ApiCampaignDetail {
  id: string;
  codigo: string;
  status: string;
  started_at: string;
  finished_at?: string | null;
  machine: { id: string; name: string };
  client: { id: string; name: string };
  article: { id: string; name: string };
}

function useCampaignDetail(campaignId: string) {
  return useQuery({
    queryKey: ['campaign-detail', campaignId],
    queryFn: async () => {
      const res = await axiosClient.get<{ data: ApiCampaignDetail }>(
        `/v1/mobile/campaigns/${campaignId}`
      );
      return res.data.data;
    },
    enabled: !!campaignId,
    staleTime: 1000 * 60 * 5, // Campaign details rarely change
  });
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function CampaignDetailScreen() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  // Campaign metadata (machine, client, article)
  const { data: campaign, isLoading: loadingCampaign } = useCampaignDetail(campaignId);

  // Single summary call — delivers KPIs + chart points + 24 recent records.
  // No second API call needed for the detail screen.
  const {
    data: summary,
    isLoading: loadingSummary,
    refetch,
    isRefetching,
  } = useCampaignYieldSummary(campaignId);

  const isHeaderLoading = loadingCampaign && !campaign;

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <AppHeader
        title={`Campaña #${campaign?.codigo ?? '...'}`}
        subtitle={`${campaign?.machine?.name ?? 'Cargando...'} · ${campaign?.article?.name ?? ''}`}
        dark
        showBack
        elevated={false}
      />

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
            <Text style={styles.infoText}>
              {summary ? `${summary.kpis.totalRecords} registros` : '…'}
            </Text>
          </View>
        </View>

        {/* ── KPI Cards — render immediately when summary arrives ── */}
        {summary && summary.kpis.totalRecords > 0 && (
          <View style={styles.kpiRow}>
            <Surface style={[styles.kpiCard, { backgroundColor: c.surface }]}>
              <Text style={[styles.kpiLabel, { color: c.textMuted }]}>PROMEDIO</Text>
              <Text style={[styles.kpiValue, { color: c.primary }]}>
                {summary.kpis.avgTotal}%
              </Text>
            </Surface>
            <Surface style={[styles.kpiCard, { backgroundColor: c.surface }]}>
              <Text style={[styles.kpiLabel, { color: c.textMuted }]}>MÁXIMO</Text>
              <Text style={[styles.kpiValue, { color: c.success }]}>
                {summary.kpis.max}%
              </Text>
            </Surface>
            <Surface style={[styles.kpiCard, { backgroundColor: c.surface }]}>
              <Text style={[styles.kpiLabel, { color: c.textMuted }]}>MÍNIMO</Text>
              <Text style={[styles.kpiValue, { color: c.error }]}>
                {summary.kpis.min}%
              </Text>
            </Surface>
          </View>
        )}

        {/* ── Chart: skeleton while loading, real chart when ready ── */}
        {loadingSummary ? (
          <YieldChartSkeleton />
        ) : summary && summary.chartPoints.length > 0 ? (
          <YieldLineChart
            chartPoints={summary.chartPoints}
            summary={summary}
            title="Tendencia de Rendimiento"
            onExpand={() =>
              router.push({
                pathname: '/campaigns/[campaignId]/chart',
                params: { campaignId },
              })
            }
          />
        ) : null}

        {/* ── Recent records list (24 pre-formatted records from backend) ── */}
        <YieldRecordList
          records={summary?.recentRecords ?? []}
          isLoading={loadingSummary}
          onExpand={() =>
            router.push({
              pathname: '/campaigns/[campaignId]/yields',
              params: { campaignId },
            })
          }
        />

        <View style={{ height: Spacing.xxl * 2 }} />
      </ScrollView>
    </View>
  );
}
