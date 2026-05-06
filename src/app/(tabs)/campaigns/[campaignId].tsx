import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Text, ActivityIndicator, Surface } from 'react-native-paper';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing } from '@/constants/theme';
import { useCampaignYields } from '@/features/admin/hooks/useCampaignYields';
import { YieldLineChart } from '@/components/yield-line-chart';
import { YieldRecordList } from '@/components/yield-record-list';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/infrastructure/api/axios-client';
import { AppHeader } from '@/components/ui/app-header';
import { StatusBar } from 'expo-status-bar';
import { styles } from './[campaignId].styles';

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
    </View>
  );
}
