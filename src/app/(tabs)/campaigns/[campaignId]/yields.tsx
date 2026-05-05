import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Text, ActivityIndicator, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useCampaignYields } from '@/features/admin/hooks/useCampaignYields';
import { LineYieldRecord } from '@/core/domain/entities';

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return { date: `${day}/${month}`, time: `${hours}:${mins}` };
}

function getYieldColor(value: number, c: any): string {
  if (value >= 95) return c.success;
  if (value >= 85) return '#e9730c';
  return c.error;
}

export default function FullYieldHistoryScreen() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const { data: yields, isLoading, refetch, isRefetching } = useCampaignYields(campaignId);

  const renderHeader = () => (
    <View style={[styles.tableHeader, { backgroundColor: scheme === 'dark' ? '#1A1A1A' : '#F0F2F5', borderBottomColor: c.border }]}>
      <View style={[styles.headerCell, styles.colTime, { borderRightColor: c.border }]}>
        <Text style={[styles.headerText, { color: c.textSecondary }]}>HORA / FECHA</Text>
      </View>
      <View style={[styles.headerCell, styles.colOperator, { borderRightColor: c.border }]}>
        <Text style={[styles.headerText, { color: c.textSecondary }]}>OPER.</Text>
      </View>
      <View style={[styles.headerCell, styles.colMetric, { borderRightColor: c.border }]}>
        <Text style={[styles.headerText, { color: c.textSecondary, textAlign: 'center' }]}>FORM.</Text>
      </View>
      <View style={[styles.headerCell, styles.colMetric, { borderRightColor: c.border }]}>
        <Text style={[styles.headerText, { color: c.textSecondary, textAlign: 'center' }]}>EMP.</Text>
      </View>
      <View style={[styles.headerCell, styles.colMetric]}>
        <Text style={[styles.headerText, { color: c.textSecondary, textAlign: 'center' }]}>AVG %</Text>
      </View>
    </View>
  );

  const renderItem = ({ item, index }: { item: LineYieldRecord; index: number }) => {
    const dt = formatDateTime(item.reportedAt);
    const formingColor = getYieldColor(item.formingYield ?? 0, c);
    const packingColor = getYieldColor(item.packingYield ?? 0, c);
    const isEven = index % 2 === 0;

    return (
      <View style={[
        styles.tableRow, 
        { backgroundColor: isEven ? c.surface : (scheme === 'dark' ? '#1E1E1E' : '#FAFAFA') },
        { borderBottomColor: c.border }
      ]}>
        <View style={[styles.cell, styles.colTime, { borderRightColor: c.border }]}>
          <Text style={[styles.cellText, { color: c.text }]}>{dt.time}</Text>
          <Text style={[styles.cellSubText, { color: c.textMuted }]}>{dt.date}</Text>
        </View>
        
        <View style={[styles.cell, styles.colOperator, { borderRightColor: c.border }]}>
          <Surface style={[styles.opBadge, { backgroundColor: c.primary + '15' }]}>
            <Text style={[styles.opText, { color: c.primary }]}>
              {item.operatorAlias?.substring(0, 2).toUpperCase() ?? '—'}
            </Text>
          </Surface>
        </View>

        <View style={[styles.cell, styles.colMetric, { borderRightColor: c.border }]}>
          <Text style={[styles.cellText, { color: formingColor, textAlign: 'center', fontWeight: '600' }]}>
            {item.formingYield?.toFixed(1)}
          </Text>
        </View>
        
        <View style={[styles.cell, styles.colMetric, { borderRightColor: c.border }]}>
          <Text style={[styles.cellText, { color: packingColor, textAlign: 'center', fontWeight: '600' }]}>
            {item.packingYield?.toFixed(1)}
          </Text>
        </View>
        
        <View style={[styles.cell, styles.colMetric, { backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)' }]}>
          <Text style={[styles.cellText, { color: c.text, fontWeight: '800', textAlign: 'center' }]}>
            {item.yieldPercentage.toFixed(1)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      <Stack.Screen 
        options={{ 
          title: 'Data Grid - Rendimiento',
          headerShown: true,
          headerStyle: { backgroundColor: c.surface },
          headerTintColor: c.text,
          headerTitleStyle: { fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
        }} 
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={c.primary} />
        </View>
      ) : (
        <View style={[styles.gridContainer, { borderColor: c.border }]}>
          {renderHeader()}
          <FlatList
            data={yields}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshing={isRefetching}
            onRefresh={refetch}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={
              <View style={styles.center}>
                <MaterialCommunityIcons name="table-off" size={48} color={c.textMuted} />
                <Text style={[styles.emptyText, { color: c.textMuted }]}>No records found</Text>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gridContainer: {
    flex: 1,
    margin: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  list: { paddingBottom: Spacing.xl },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'stretch',
  },
  headerCell: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  headerText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'stretch',
    minHeight: 48,
  },
  cell: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  cellText: {
    fontSize: 13,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  cellSubText: {
    fontSize: 8,
    fontWeight: '700',
    marginTop: 1,
  },
  colTime: {
    width: 80,
    paddingLeft: 8,
  },
  colOperator: {
    width: 50,
    alignItems: 'center',
  },
  colMetric: {
    flex: 1,
  },
  opBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opText: {
    fontSize: 10,
    fontWeight: '800',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});
