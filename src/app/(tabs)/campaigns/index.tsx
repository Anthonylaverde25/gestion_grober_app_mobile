import React, { useState } from 'react';
import {
  View,
  SectionList,
  RefreshControl,
} from 'react-native';
import { Text, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { useQuery } from '@tanstack/react-query';
import { MachineRepository } from '@/infrastructure/api/repositories/MachineRepository';
import { CampaignCard } from '@/components/campaign-card';
import { Campaign } from '@/core/domain/entities';
import { AppHeader } from '@/components/ui/app-header';
import { styles } from './index.styles';

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
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <StatusBar style="light" />
      <AppHeader
        title="Campañas"
        subtitle="Gestión de rendimiento operativo"
        dark
        showBack
        elevated={false}
      />

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
    </View>
  );
}
