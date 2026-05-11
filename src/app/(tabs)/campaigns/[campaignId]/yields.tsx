import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useCampaignYields } from '@/features/admin/hooks/useCampaignYields';
import { LineYieldRecord } from '@/core/domain/entities';

// ── Helpers ───────────────────────────────────────────────────────────────────
// Note: date formatting happens here because this screen uses the raw LineYieldRecord
// from the paginated endpoint (not the pre-formatted RecentYieldRecord).
// Backend formats the summary records; this is the only place we format dates on frontend.
function fmtTime(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}
function fmtDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
}
function yieldColor(v: number, c: any) {
  if (v >= 95) return c.success;
  if (v >= 85) return '#e9730c';
  return c.error;
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function FullYieldHistoryScreen() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const {
    allRecords,
    totalRecords,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useCampaignYields(campaignId);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── Table header (sticky) ────────────────────────────────────────────────
  const TableHeader = () => (
    <View style={[styles.tableHeader, { backgroundColor: scheme === 'dark' ? '#1A1A1A' : '#F0F2F5', borderBottomColor: c.border }]}>
      {['HORA / FECHA', 'OPER.', 'FORM.', 'EMP.', 'AVG %'].map((h, i) => (
        <View
          key={h}
          style={[
            styles.headerCell,
            i === 0 ? styles.colTime : i === 1 ? styles.colOperator : styles.colMetric,
            { borderRightColor: c.border },
          ]}
        >
          <Text style={[styles.headerText, { color: c.textSecondary, textAlign: i > 1 ? 'center' : 'left' }]}>
            {h}
          </Text>
        </View>
      ))}
    </View>
  );

  // ── Row renderer ─────────────────────────────────────────────────────────
  const renderItem = ({ item, index }: { item: LineYieldRecord; index: number }) => {
    const isEven = index % 2 === 0;
    const avg = item.yieldPercentage;
    return (
      <View style={[
        styles.tableRow,
        { backgroundColor: isEven ? c.surface : (scheme === 'dark' ? '#1E1E1E' : '#FAFAFA') },
        { borderBottomColor: c.border },
      ]}>
        <View style={[styles.cell, styles.colTime, { borderRightColor: c.border }]}>
          <Text style={[styles.cellText, { color: c.text }]}>{fmtTime(item.reportedAt)}</Text>
          <Text style={[styles.cellSub, { color: c.textMuted }]}>{fmtDate(item.reportedAt)}</Text>
        </View>
        <View style={[styles.cell, styles.colOperator, { borderRightColor: c.border }]}>
          <Surface style={[styles.opBadge, { backgroundColor: c.primary + '15' }]}>
            <Text style={[styles.opText, { color: c.primary }]}>
              {item.operatorAlias?.substring(0, 2).toUpperCase() ?? '—'}
            </Text>
          </Surface>
        </View>
        <View style={[styles.cell, styles.colMetric, { borderRightColor: c.border }]}>
          <Text style={[styles.cellText, { color: yieldColor(item.formingYield ?? 0, c), textAlign: 'center', fontWeight: '600' }]}>
            {item.formingYield?.toFixed(1)}
          </Text>
        </View>
        <View style={[styles.cell, styles.colMetric, { borderRightColor: c.border }]}>
          <Text style={[styles.cellText, { color: yieldColor(item.packingYield ?? 0, c), textAlign: 'center', fontWeight: '600' }]}>
            {item.packingYield?.toFixed(1)}
          </Text>
        </View>
        <View style={[styles.cell, styles.colMetric]}>
          <Text style={[styles.cellText, { color: yieldColor(avg, c), fontWeight: '800', textAlign: 'center' }]}>
            {avg.toFixed(1)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Historial de Rendimiento',
          headerShown: true,
          headerStyle: { backgroundColor: c.surface },
          headerTintColor: c.text,
          headerTitleStyle: { fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
          headerRight: () =>
            totalRecords > 0 ? (
              <Text style={{ color: c.textMuted, fontSize: 11, fontWeight: '600', marginRight: 16 }}>
                {allRecords.length} / {totalRecords}
              </Text>
            ) : null,
        }}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={c.primary} />
        </View>
      ) : (
        <View style={[styles.gridContainer, { borderColor: c.border }]}>
          <FlatList
            data={allRecords}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={<TableHeader />}
            stickyHeaderIndices={[0]}
            contentContainerStyle={styles.list}
            refreshing={isRefetching}
            onRefresh={refetch}
            showsVerticalScrollIndicator
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.25}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color={c.primary} />
                  <Text style={[styles.footerText, { color: c.textMuted }]}>
                    Cargando más registros…
                  </Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <MaterialCommunityIcons name="table-off" size={48} color={c.textMuted} />
                <Text style={[styles.emptyText, { color: c.textMuted }]}>Sin registros</Text>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  gridContainer:{ flex: 1, margin: Spacing.sm, borderWidth: 1, borderRadius: BorderRadius.sm, overflow: 'hidden' },
  list:         { paddingBottom: Spacing.xl },
  tableHeader:  { flexDirection: 'row', borderBottomWidth: 1, alignItems: 'stretch' },
  headerCell:   { paddingVertical: 10, paddingHorizontal: 4, justifyContent: 'center', borderRightWidth: 1 },
  headerText:   { fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  tableRow:     { flexDirection: 'row', borderBottomWidth: 1, alignItems: 'stretch', minHeight: 48 },
  cell:         { paddingVertical: 6, paddingHorizontal: 4, justifyContent: 'center', borderRightWidth: 1 },
  cellText:     { fontSize: 13, fontWeight: '500', fontVariant: ['tabular-nums'] },
  cellSub:      { fontSize: 8, fontWeight: '700', marginTop: 1 },
  colTime:      { width: 80, paddingLeft: 8 },
  colOperator:  { width: 50, alignItems: 'center' },
  colMetric:    { flex: 1 },
  opBadge:      { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignItems: 'center' },
  opText:       { fontSize: 10, fontWeight: '800' },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xxl },
  emptyText:    { marginTop: Spacing.md, fontSize: FontSize.sm, fontWeight: '600' },
  footerLoader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: Spacing.lg },
  footerText:   { fontSize: 12, fontWeight: '600' },
});
