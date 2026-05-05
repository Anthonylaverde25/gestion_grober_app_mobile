import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import { LineYieldRecord, YieldStats } from '@/core/domain/entities';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface YieldLineChartProps {
  records: LineYieldRecord[];
  stats: YieldStats;
  title?: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export function YieldLineChart({ records, stats, title }: YieldLineChartProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  if (records.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: c.surface }]}>
        <Text style={[styles.emptyText, { color: c.textMuted }]}>
          Sin datos de rendimiento
        </Text>
      </View>
    );
  }

  // Build data points for gifted-charts
  const data = records.map((r, i) => ({
    value: r.yieldPercentage,
    label: records.length <= 8 ? formatTime(r.reportedAt) : (i % Math.ceil(records.length / 6) === 0 ? formatTime(r.reportedAt) : ''),
    dataPointText: '',
  }));

  const chartWidth = SCREEN_WIDTH - Spacing.md * 2 - Spacing.xl;

  return (
    <View style={[styles.container, { backgroundColor: c.surface }]}>
      {/* Header */}
      {title && (
        <Text style={[styles.chartTitle, { color: c.text }]}>{title}</Text>
      )}

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatBubble label="Promedio" value={`${stats.average}%`} color={c.primary} />
        <StatBubble label="Máximo" value={`${stats.max}%`} color={c.success} />
        <StatBubble label="Mínimo" value={`${stats.min}%`} color={c.error} />
        <StatBubble
          label="Tendencia"
          value={stats.trend === 'up' ? '↑' : stats.trend === 'down' ? '↓' : '→'}
          color={stats.trend === 'up' ? c.success : stats.trend === 'down' ? c.error : c.textMuted}
        />
      </View>

      {/* Chart */}
      <View style={styles.chartWrapper}>
        <LineChart
          data={data}
          width={chartWidth}
          height={180}
          color={c.chart.primary}
          thickness={2.5}
          startFillColor={c.chart.primary + '40'}
          endFillColor={c.chart.primary + '05'}
          areaChart
          curved
          hideDataPoints={records.length > 20}
          dataPointsColor={c.chart.primary}
          dataPointsRadius={4}
          xAxisColor={c.border}
          yAxisColor={c.border}
          xAxisLabelTextStyle={{ color: c.textMuted, fontSize: 9 }}
          yAxisTextStyle={{ color: c.textMuted, fontSize: 9 }}
          rulesColor={c.chart.grid}
          rulesType="dashed"
          yAxisTextNumberOfLines={1}
          maxValue={100}
          noOfSections={5}
          yAxisLabelSuffix="%"
          isAnimated
          animationDuration={600}
          hideRules={false}
          spacing={Math.max(20, (chartWidth - 40) / Math.max(data.length - 1, 1))}
          initialSpacing={10}
          endSpacing={10}
        />
      </View>

      {/* Record count */}
      <Text style={[styles.recordCount, { color: c.textMuted }]}>
        {records.length} registro{records.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );
}

function StatBubble({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.bubble}>
      <Text style={[styles.bubbleValue, { color }]}>{value}</Text>
      <Text style={styles.bubbleLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  chartTitle: {
    fontSize: FontSize.base,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  bubble: {
    alignItems: 'center',
    flex: 1,
  },
  bubbleValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  bubbleLabel: {
    fontSize: FontSize.xs,
    color: '#9ba4ae',
    fontWeight: '500',
    marginTop: 2,
  },
  chartWrapper: {
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  empty: {
    height: 160,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  recordCount: {
    fontSize: FontSize.xs,
    textAlign: 'right',
    marginTop: Spacing.sm,
  },
});
