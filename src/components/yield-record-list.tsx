import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineYieldRecord } from '@/core/domain/entities';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface YieldRecordListProps {
  records: LineYieldRecord[];
  isLoading?: boolean;
  onExpand?: () => void;
}

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

export function YieldRecordList({ records, isLoading, onExpand }: YieldRecordListProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const sorted = [...records].sort(
    (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  );

  const renderRecord = ({ item, index }: { item: LineYieldRecord; index: number }) => {
    const dt = formatDateTime(item.reportedAt);
    const formingColor = getYieldColor(item.formingYield ?? 0, c);
    const packingColor = getYieldColor(item.packingYield ?? 0, c);

    return (
      <View style={{ marginTop: Spacing.sm }}>
        <View style={styles.row}>
          {/* Time column */}
          <View style={styles.timeCol}>
            <Text style={[styles.timeText, { color: c.text }]}>{dt.time}</Text>
            <Text style={[styles.dateText, { color: c.textMuted }]}>{dt.date}</Text>
          </View>

          {/* Divider line */}
          <View style={styles.timelineCol}>
            <View style={[styles.timelineDot, { backgroundColor: c.primary }]} />
            {index < sorted.length - 1 && (
              <View style={[styles.timelineLine, { backgroundColor: c.border }]} />
            )}
          </View>

          {/* Yield data */}
          <View style={[styles.dataCard, { backgroundColor: c.surface }]}>
            {/* Operator */}
            {item.operatorAlias && (
              <View style={styles.operatorRow}>
                <MaterialCommunityIcons name="account-outline" size={12} color={c.primary} />
                <Text style={[styles.operatorText, { color: c.primary }]} numberOfLines={1}>
                  {item.operatorAlias}
                </Text>
              </View>
            )}

            {/* Yield values row */}
            <View style={styles.valuesRow}>
              {/* Forming */}
              <View style={styles.valueBlock}>
                <Text style={[styles.valueLabel, { color: c.textMuted }]}>FORMING</Text>
                <Text style={[styles.valueNumber, { color: formingColor }]}>
                  {item.formingYield !== undefined ? `${item.formingYield.toFixed(1)}%` : '—'}
                </Text>
              </View>

              {/* Separator */}
              <View style={[styles.valueSep, { backgroundColor: c.border }]} />

              {/* Packing */}
              <View style={styles.valueBlock}>
                <Text style={[styles.valueLabel, { color: c.textMuted }]}>PACKING</Text>
                <Text style={[styles.valueNumber, { color: packingColor }]}>
                  {item.packingYield !== undefined ? `${item.packingYield.toFixed(1)}%` : '—'}
                </Text>
              </View>

              {/* Average */}
              <View style={[styles.valueSep, { backgroundColor: c.border }]} />
              <View style={styles.valueBlock}>
                <Text style={[styles.valueLabel, { color: c.textMuted }]}>AVG</Text>
                <Text style={[styles.valueNumber, { color: c.text, fontWeight: '800' }]}>
                  {item.yieldPercentage.toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (sorted.length === 0 && !isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="chart-line-variant" size={36} color={c.textMuted} />
        <Text style={[styles.emptyText, { color: c.textMuted }]}>
          Sin registros de rendimiento
        </Text>
      </View>
    );
  }

  return (
    <View>
      {/* Header */}
      <View style={[styles.listHeader, { borderBottomColor: c.border }]}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="clipboard-text-clock-outline" size={14} color={c.textSecondary} />
          <Text style={[styles.listHeaderText, { color: c.textSecondary }]}>
            TRAZABILIDAD · {sorted.length} REGISTRO{sorted.length !== 1 ? 'S' : ''}
          </Text>
        </View>
        {onExpand && (
          <TouchableOpacity onPress={onExpand} style={styles.expandBtn}>
            <MaterialCommunityIcons name="arrow-expand" size={18} color={c.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Records */}
      {sorted.map((item, index) => (
        <View key={item.id}>
          {renderRecord({ item, index })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    minHeight: 64,
  },
  timeCol: {
    width: 40,
    alignItems: 'center',
    paddingTop: Spacing.sm,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  dateText: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 1,
  },
  timelineCol: {
    width: 24,
    alignItems: 'center',
    paddingTop: Spacing.sm + 2,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    marginTop: 4,
  },
  dataCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
    marginBottom: Spacing.sm,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  operatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  operatorText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    flex: 1,
  },
  valuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueBlock: {
    flex: 1,
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  valueNumber: {
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  valueSep: {
    width: 1,
    height: 28,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  listHeaderText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  headerTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expandBtn: {
    padding: 4,
  },
});
