import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Text, ActivityIndicator, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useCompanies } from '@/features/admin/hooks/useCompanies';
import { CompanyCard } from '@/components/company-card';
import { Company } from '@/core/domain/entities';

export default function CompaniesScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [search, setSearch] = useState('');
  const { data: companies, isLoading, refetch, isRefetching, error } = useCompanies();

  const filtered = (companies ?? []).filter((co) =>
    co.name.toLowerCase().includes(search.toLowerCase()) ||
    co.country?.toLowerCase().includes(search.toLowerCase())
  );

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
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      {/* ── Page Header ── */}
      <View style={[styles.pageHeader, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <View>
          <Text style={[styles.pageTitle, { color: c.text }]}>Empresas</Text>
          <Text style={[styles.pageSubtitle, { color: c.textMuted }]}>
            {isLoading ? '...' : `${filtered.length} empresa${filtered.length !== 1 ? 's' : ''}`}
          </Text>
        </View>
        <View style={[styles.headerIcon, { backgroundColor: c.primary + '12' }]}>
          <MaterialCommunityIcons name="domain" size={22} color={c.primary} />
        </View>
      </View>

      {/* ── Search ── */}
      <View style={[styles.searchContainer, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <Searchbar
          placeholder="Buscar empresa o país..."
          onChangeText={setSearch}
          value={search}
          style={[styles.searchBar, { backgroundColor: c.background }]}
          inputStyle={{ fontSize: FontSize.sm, color: c.text }}
          placeholderTextColor={c.textMuted}
          iconColor={c.textMuted}
        />
      </View>

      {/* ── Content ── */}
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
          data={filtered}
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
                {search ? 'Sin resultados para tu búsqueda' : 'No hay empresas registradas'}
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
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  searchBar: {
    borderRadius: BorderRadius.md,
    elevation: 0,
    height: 42,
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
});
