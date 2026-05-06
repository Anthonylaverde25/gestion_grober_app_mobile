import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useMachineCampaigns } from '@/features/admin/hooks/useMachineCampaigns';
import { CampaignCard } from '@/components/campaign-card';
import { Campaign } from '@/core/domain/entities';
import { AppHeader } from '@/components/ui/app-header';

export default function MachineDetailScreen() {
  const { companyId, machineId } = useLocalSearchParams<{
    companyId: string;
    machineId: string;
  }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const { data: campaigns, isLoading, refetch, isRefetching, error } =
    useMachineCampaigns(machineId, companyId);

  const filtered = (campaigns ?? []).filter((ca) => {
    if (filter === 'all') return true;
    return ca.status === filter;
  });

  const activeCount =
    campaigns?.filter((c) => c.status === 'active').length ?? 0;

  /**
   * Navegación cross-stack: desde el stack de companies navegamos al
   * detalle de una campaña que vive en el stack de campaigns.
   * Usamos la ruta absoluta con el grupo (tabs) para que Expo Router
   * resuelva correctamente la pantalla sin intentar buscarla en el
   * stack actual (companies).
   */
  const handleCampaignPress = (campaign: Campaign) => {
    router.push({
      pathname: '/(tabs)/campaigns/[campaignId]',
      params: { campaignId: campaign.id },
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: c.background }]}
    >
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <AppHeader
        title="Horno / Máquina"
        subtitle={`${activeCount} campaña${activeCount !== 1 ? 's' : ''} activa${activeCount !== 1 ? 's' : ''}`}
        dark
        showBack
        elevated={false}
      />

      {/* ── Filter bar ── */}
      <View
        style={[
          styles.filterBar,
          { backgroundColor: c.surface, borderBottomColor: c.border },
        ]}
      >
        <SegmentedButtons
          value={filter}
          onValueChange={(v) => setFilter(v as typeof filter)}
          buttons={[
            {
              value: 'all',
              label: 'Todas',
              style: { borderRadius: BorderRadius.sm },
            },
            {
              value: 'active',
              label: 'Activas',
              style: { borderRadius: BorderRadius.sm },
            },
            {
              value: 'completed',
              label: 'Completadas',
              style: { borderRadius: BorderRadius.sm },
            },
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
          <Text style={[styles.loadingText, { color: c.textMuted }]}>
            Cargando campañas...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={40}
            color={c.error}
          />
          <Text style={[styles.errorText, { color: c.error }]}>
            Error al cargar las campañas
          </Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={c.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>
              {filtered.length} CAMPAÑA{filtered.length !== 1 ? 'S' : ''} ·
              TOCA PARA VER RENDIMIENTO
            </Text>
          </View>

          {filtered.length === 0 ? (
            <View style={styles.center}>
              <MaterialCommunityIcons
                name="factory"
                size={40}
                color={c.textMuted}
              />
              <Text style={[styles.emptyText, { color: c.textMuted }]}>
                {filter !== 'all'
                  ? `No hay campañas ${
                      filter === 'active' ? 'activas' : 'completadas'
                    }`
                  : 'No hay campañas registradas'}
              </Text>
            </View>
          ) : (
            filtered.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onPress={() => handleCampaignPress(campaign)}
              />
            ))
          )}

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      )}
    </View>
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
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
  list: { paddingTop: Spacing.sm },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xxl,
  },
  loadingText: { fontSize: FontSize.sm, fontWeight: '500', marginTop: Spacing.sm },
  errorText: { fontSize: FontSize.base, fontWeight: '700' },
  emptyText: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
