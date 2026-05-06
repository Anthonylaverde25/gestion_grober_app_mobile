import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineYieldRecord } from '@/core/domain/entities';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { styles } from './yield-record-list.styles';

interface YieldRecordListProps {
  records: LineYieldRecord[];
  isLoading?: boolean;
  onExpand?: () => void;
}

function formatDateTime(dateStr: string | undefined) {
  if (!dateStr) return { date: '--/--', time: '--:--' };
  try {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return { date: `${day}/${month}`, time: `${hours}:${mins}` };
  } catch (e) {
    return { date: '--/--', time: '--:--' };
  }
}

function getYieldColor(value: number, c: any): string {
  if (value >= 95) return c.success;
  if (value >= 85) return '#e9730c';
  return c.error;
}

export function YieldRecordList({ records = [], isLoading, onExpand }: YieldRecordListProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const sorted = [...(records || [])].sort(
    (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  );

  if (sorted.length === 0 && !isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="clipboard-off-outline" size={36} color={c.textMuted} />
        <Text style={[styles.emptyText, { color: c.textMuted }]}>
          Sin registros de trazabilidad
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* List Header */}
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

      {/* Record List */}
      {sorted.slice(0, 8).map((item, index) => {
        const dt = formatDateTime(item.reportedAt);
        const totalValue = item.yieldPercentage ?? ((item.formingYield + item.packingYield) / 2);
        
        return (
          <View key={item.id || index} style={styles.recordItem}>
            {/* Time Column */}
            <View style={styles.timeCol}>
              <Text style={[styles.timeText, { color: c.text }]}>{dt.time}</Text>
              <Text style={styles.dateText}>{dt.date}</Text>
            </View>

            {/* Content Column */}
            <View style={styles.contentCol}>
              <Surface style={[styles.dataCard, { backgroundColor: c.surface }]}>
                {/* Operator info */}
                <View style={styles.operatorRow}>
                  <MaterialCommunityIcons name="account-circle-outline" size={12} color={c.textMuted} />
                  <Text style={[styles.operatorText, { color: c.textMuted }]}>
                    OPERARIO DE TURNO
                  </Text>
                </View>

                {/* Metrics row */}
                <View style={styles.metricsRow}>
                  <View style={styles.metricBlock}>
                    <Text style={styles.metricLabel}>FORMING</Text>
                    <Text style={[styles.metricValue, { color: getYieldColor(item.formingYield, c) }]}>
                      {(item.formingYield ?? 0).toFixed(1)}%
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.metricBlock}>
                    <Text style={styles.metricLabel}>PACKING</Text>
                    <Text style={[styles.metricValue, { color: getYieldColor(item.packingYield, c) }]}>
                      {(item.packingYield ?? 0).toFixed(1)}%
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.metricBlock}>
                    <Text style={styles.metricLabel}>TOTAL</Text>
                    <Text style={[styles.metricValue, styles.totalValue, { color: c.primary }]}>
                      {(totalValue ?? 0).toFixed(1)}%
                    </Text>
                  </View>
                </View>
              </Surface>
            </View>
          </View>
        );
      })}

      {sorted.length > 8 && (
        <TouchableOpacity style={styles.seeMoreBtn} onPress={onExpand}>
          <Text style={{ color: c.primary, fontWeight: '700', fontSize: 11, letterSpacing: 0.5 }}>
            VER HISTORIAL COMPLETO ({sorted.length}) →
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
