import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RecentYieldRecord } from '@/core/domain/entities';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { styles } from './yield-record-list.styles';

interface YieldRecordListProps {
  records: RecentYieldRecord[];
  isLoading?: boolean;
  onExpand?: () => void;
}

/** Color based on yield value — thresholds defined once, no repeated computation */
function yieldColor(value: number, c: any): string {
  if (value >= 95) return c.success;
  if (value >= 85) return '#e9730c';
  return c.error;
}

export function YieldRecordList({ records = [], isLoading, onExpand }: YieldRecordListProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  if (records.length === 0 && !isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="clipboard-off-outline" size={36} color={c.textMuted} />
        <Text style={[styles.emptyText, { color: c.textMuted }]}>Sin registros de trazabilidad</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* ── Header ── */}
      <View style={[styles.listHeader, { borderBottomColor: c.border }]}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="format-list-bulleted" size={14} color={c.textSecondary} />
          <Text style={[styles.listHeaderText, { color: c.textSecondary }]}>
            TRAZABILIDAD DE RENDIMIENTO
          </Text>
        </View>
        {onExpand && (
          <TouchableOpacity onPress={onExpand} style={styles.expandBtn}>
            <MaterialCommunityIcons name="arrow-expand" size={18} color={c.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Records (all 24 passed in — no slice) ── */}
      {records.map((item, index) => (
        <View key={item.id || index} style={styles.recordItem}>
          {/* Time Column — pre-formatted by backend, no Date() calls */}
          <View style={styles.timeCol}>
            <Text style={[styles.timeText, { color: c.text }]}>{item.timeLabel}</Text>
            <Text style={styles.dateText}>{item.dateLabel}</Text>
          </View>

          {/* Content Column */}
          <View style={styles.contentCol}>
            <Surface style={[styles.dataCard, { backgroundColor: c.surface }]}>
              <View style={styles.operatorRow}>
                <MaterialCommunityIcons name="account-circle-outline" size={12} color={c.textMuted} />
                <Text style={[styles.operatorText, { color: c.textMuted }]}>
                  {item.operatorAlias ?? 'OPERARIO DE TURNO'}
                </Text>
              </View>
              <View style={styles.metricsRow}>
                <View style={styles.metricBlock}>
                  <Text style={styles.metricLabel}>FORMING</Text>
                  <Text style={[styles.metricValue, { color: yieldColor(item.formingYield, c) }]}>
                    {item.formingYield.toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.metricBlock}>
                  <Text style={styles.metricLabel}>PACKING</Text>
                  <Text style={[styles.metricValue, { color: yieldColor(item.packingYield, c) }]}>
                    {item.packingYield.toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.metricBlock}>
                  <Text style={styles.metricLabel}>TOTAL</Text>
                  <Text style={[styles.metricValue, styles.totalValue, { color: c.primary }]}>
                    {item.avgYield.toFixed(1)}%
                  </Text>
                </View>
              </View>
            </Surface>
          </View>
        </View>
      ))}

      {/* ── Ver historial completo ── */}
      {onExpand && (
        <TouchableOpacity style={styles.seeMoreBtn} onPress={onExpand}>
          <Text style={{ color: c.primary, fontWeight: '700', fontSize: 11, letterSpacing: 0.5 }}>
            VER HISTORIAL COMPLETO →
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
