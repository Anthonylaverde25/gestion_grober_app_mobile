import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useCompany, useCompanyMachines } from '@/features/admin/hooks/useCompanies';
import { MachineCard } from '@/components/machine-card';
import { Machine } from '@/core/domain/entities';
import { AppHeader } from '@/components/ui/app-header';
import { StatusBar } from 'expo-status-bar';
import { styles } from './[companyId].styles';

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
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <AppHeader
        title={company?.name ?? 'Empresa'}
        subtitle={company?.country}
        dark
        showBack
        elevated={false}
      />

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
    </View>
  );
}
