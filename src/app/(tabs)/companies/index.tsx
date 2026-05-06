import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useCompanies } from '@/features/admin/hooks/useCompanies';
import { CompanyCard } from '@/components/company-card';
import { Company } from '@/core/domain/entities';
import { AppHeader } from '@/components/ui/app-header';
import { styles } from './index.styles';

export default function CompaniesScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { data: companies, isLoading, refetch, isRefetching, error } = useCompanies();

  const renderItem = ({ item }: { item: Company }) => (
    <Link
      href={{
        pathname: '/companies/[companyId]',
        params: { companyId: item.id },
      }}
      asChild
    >
      <CompanyCard company={item} />
    </Link>
  );

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <StatusBar style="light" />
      <AppHeader
        title="Empresas"
        subtitle={isLoading ? '...' : `${companies?.length ?? 0} empresa${companies?.length !== 1 ? 's' : ''}`}
        dark
        showBack
        elevated={false}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={c.primary} />
          <Text style={[styles.loadingText, { color: c.textMuted }]}>Cargando empresas...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="alert-circle-outline" size={40} color={c.error} />
          <Text style={[styles.errorText, { color: c.error }]}>Error al cargar las empresas</Text>
          <Text style={[styles.errorSub, { color: c.textMuted }]}>
            Verifique su conexión y vuelva a intentarlo
          </Text>
        </View>
      ) : (
        <FlatList
          data={companies}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={c.primary} />
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialCommunityIcons name="domain-off" size={40} color={c.textMuted} />
              <Text style={[styles.emptyText, { color: c.textMuted }]}>
                No hay empresas registradas
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
