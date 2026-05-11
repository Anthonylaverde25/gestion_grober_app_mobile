import React from 'react';
import {
  View,
  SectionList,
  RefreshControl,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useQuery } from '@tanstack/react-query';
import { MachineRepository } from '@/infrastructure/api/repositories/MachineRepository';
import { CampaignCard } from '@/components/campaign-card';
import { Campaign } from '@/core/domain/entities';
import { AppHeader } from '@/components/ui/app-header';
import { styles } from './index.styles';

export default function CampaignsListScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const {
    data: campaigns,
    isLoading,
    refetch,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ['campaigns-list-active'],
    queryFn: () => MachineRepository.getActiveCampaigns(),
    staleTime: 1000 * 60 * 2,
  });

  const activeCampaigns = campaigns ?? [];

  const sections = React.useMemo(() => {
    const groups: { [key: string]: Campaign[] } = {};
    activeCampaigns.forEach((ca) => {
      const coName = ca.companyName || 'Empresa Desconocida';
      if (!groups[coName]) groups[coName] = [];
      groups[coName].push(ca);
    });
    return Object.keys(groups).map((name) => ({
      title: name,
      data: groups[name],
    }));
  }, [activeCampaigns]);

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
        title="Campañas Activas"
        subtitle="Monitoreo de rendimiento en tiempo real"
        dark
        showBack
        elevated={false}
      />

      <View style={[styles.statsStrip, { backgroundColor: c.primary }]}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{activeCampaigns.length}</Text>
          <Text style={styles.statLabel}>En Producción</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {activeCampaigns.reduce((acc, curr) => acc + (curr.totalYieldRecords || 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Registros Totales</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={c.primary} />
          <Text style={[styles.loadingText, { color: c.textMuted }]}>Sincronizando operaciones...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="alert-circle-outline" size={40} color={c.error} />
          <Text style={[styles.errorText, { color: c.error }]}>Error de conexión</Text>
          <Text style={[styles.errorSub, { color: c.textMuted }]}>
            No se pudieron obtener las campañas activas.
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
                {activeCampaigns.length} OPERACIÓ{activeCampaigns.length !== 1 ? 'NES' : 'N'} EN CURSO
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialCommunityIcons name="factory" size={40} color={c.textMuted} />
              <Text style={[styles.emptyText, { color: c.textMuted }]}>
                No hay campañas activas en este momento
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
