import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import { LineYieldRecord, YieldStats } from '@/core/domain/entities';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography } from '@/shared/theme/typography';

interface YieldLineChartProps {
  records: LineYieldRecord[];
  stats: YieldStats;
  title?: string;
  onExpand?: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export function YieldLineChart({ records, stats, title, onExpand }: YieldLineChartProps) {
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

  const formingData = records.map((r, i) => ({
    value: r.formingYield ?? 0,
    label: records.length <= 8 ? formatTime(r.reportedAt) : (i % Math.ceil(records.length / 6) === 0 ? formatTime(r.reportedAt) : ''),
  }));

  const packingData = records.map((r) => ({
    value: r.packingYield ?? 0,
  }));

  const chartWidth = SCREEN_WIDTH - Spacing.md * 2 - Spacing.xl;

  return (
    <View style={styles.mainContainer}>
      {/* Header & Stats (Above the card) */}
      <View style={styles.externalHeader}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleRow}>
            <MaterialCommunityIcons name="chart-line" size={14} color={c.textSecondary} />
            <Text style={[styles.listHeaderText, { color: c.textSecondary }]}>
              {title?.toUpperCase() ?? 'TENDENCIA DE RENDIMIENTO'}
            </Text>
          </View>
          {onExpand && (
            <TouchableOpacity onPress={onExpand} style={styles.expandBtn}>
              <MaterialCommunityIcons name="arrow-expand" size={18} color={c.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Row with Space-Between for Trend */}
        <View style={styles.statsRow}>
          <View style={styles.statsGroupLeft}>
            <StatItem label="AVG" value={`${stats.average}%`} color={c.text} />
            <StatItem
              label="FORMING"
              value={`${(records.reduce((acc, r) => acc + (r.formingYield || 0), 0) / (records.length || 1)).toFixed(0)}%`}
              color="#6366f1"
            />
            <StatItem
              label="PACKING"
              value={`${(records.reduce((acc, r) => acc + (r.packingYield || 0), 0) / (records.length || 1)).toFixed(0)}%`}
              color="#10b981"
            />
          </View>

          <StatItem
            label="TREND"
            value={stats.trend === 'up' ? '↑' : stats.trend === 'down' ? '↓' : '→'}
            color={stats.trend === 'up' ? c.success : stats.trend === 'down' ? c.error : c.textMuted}
            align="flex-end"
          />
        </View>
      </View>

      {/* Card Content (Chart Only) */}
      <View style={[styles.container, { backgroundColor: c.surface }]}>
        <View style={styles.chartWrapper}>
          <LineChart
            data={formingData}
            data2={packingData}
            width={chartWidth}
            height={160}
            color="#6366f1"
            color2="#10b981"
            thickness={2.5}
            thickness2={2.5}
            areaChart
            curved
            startFillColor="rgba(99, 102, 241, 0.12)"
            startFillColor2="rgba(16, 185, 129, 0.12)"
            endFillColor="transparent"
            endFillColor2="transparent"
            hideDataPoints={false}
            dataPointsColor="#6366f1"
            dataPointsColor2="#10b981"
            dataPointsRadius={3.5}
            dataPointsRadius2={3.5}
            xAxisColor={c.border}
            yAxisColor={c.border}
            xAxisLabelTextStyle={{ color: c.textMuted, fontSize: 9 }}
            yAxisTextStyle={{ color: c.textMuted, fontSize: 9 }}
            rulesColor={c.border}
            rulesType="dashed"
            showVerticalLines={true}
            verticalLinesColor={c.border}
            verticalLinesThickness={1}
            verticalLinesStrokeDashArray={[3, 3]}
            yAxisTextNumberOfLines={1}
            maxValue={100}
            noOfSections={5}
            yAxisLabelSuffix="%"
            isAnimated
            animationDuration={600}
            hideRules={false}
            spacing={Math.max(25, (chartWidth - 40) / Math.max(formingData.length - 1, 1))}
            initialSpacing={10}
            endSpacing={10}
            pointerConfig={{
              pointerStripUptoDataPoint: true,
              pointerStripColor: 'rgba(99, 102, 241, 0.4)',
              pointerStripWidth: 2,
              strokeDashArray: [2, 5],
              pointerColor: '#6366f1',
              radius: 6,
              pointerLabelComponent: (items: any) => {
                return (
                  <View style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    padding: 8,
                    borderRadius: 8,
                    width: 100,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    bottom: 40,
                    left: -40,
                  }}>
                    <View style={{ gap: 4 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: '#818cf8', fontWeight: '700' }}>F</Text>
                        <Text style={{ fontSize: 10, color: '#fff', fontWeight: '900' }}>{items[0].value}%</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: '#34d399', fontWeight: '700' }}>P</Text>
                        <Text style={{ fontSize: 10, color: '#fff', fontWeight: '900' }}>{items[1]?.value || 0}%</Text>
                      </View>
                    </View>
                  </View>
                );
              },
            }}
          />
        </View>

        <View style={styles.footerRow}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#6366f1' }]} /><Text style={styles.legendText}>Forming</Text>
            <View style={[styles.legendDot, { backgroundColor: '#10b981', marginLeft: 10 }]} /><Text style={styles.legendText}>Packing</Text>
          </View>
          <Text style={[styles.recordCount, { color: c.textMuted }]}>
            {records.length} registros
          </Text>
        </View>
      </View>
    </View>
  );
}

function StatItem({ label, value, color, align = 'flex-start' }: { label: string; value: string; color: string; align?: 'flex-start' | 'flex-end' | 'center' }) {
  return (
    <View style={[styles.statItem, { alignItems: align }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: Spacing.md,
  },
  externalHeader: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,

  },
  container: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listHeaderText: {
    ...Typography.label,
    fontSize: 10,
    color: '#9ba4ae',
  },
  expandBtn: {
    padding: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
  },
  statsGroupLeft: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  statItem: {
    minWidth: 40,
  },
  statValue: {
    ...Typography.title,
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  statLabel: {
    ...Typography.label,
    fontSize: 8,
    color: '#9ba4ae',
    marginTop: 1,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9ba4ae',
    marginLeft: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
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
    ...Typography.caption,
  },
  recordCount: {
    ...Typography.hint,
    fontSize: 9,
    fontWeight: '600',
  }
});
