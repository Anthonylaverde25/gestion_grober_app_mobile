import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import { YieldChartPoint, CampaignYieldSummary } from '@/core/domain/entities';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography } from '@/shared/theme/typography';

interface YieldLineChartProps {
  /** Pre-processed chart points from the backend — label is ready-to-use. */
  chartPoints: YieldChartPoint[];
  summary: CampaignYieldSummary;
  title?: string;
  onExpand?: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const ZOOM_72H = 72;

export function YieldLineChart({ chartPoints, summary, title, onExpand }: YieldLineChartProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [zoom72h, setZoom72h] = useState(false);

  const canZoom = chartPoints.length > ZOOM_72H;

  // When zoomed: last 72 points. Otherwise all.
  const visiblePoints = useMemo(
    () => (zoom72h && canZoom ? chartPoints.slice(-ZOOM_72H) : chartPoints),
    [chartPoints, zoom72h, canZoom]
  );

  // Labels: show every Nth label to avoid crowding — all computation backend-side.
  // Frontend just decides which pre-formatted labels to show based on density.
  const step = Math.max(1, Math.ceil(visiblePoints.length / 10));
  const formingData = visiblePoints.map((p, i) => ({
    value: p.avgForming,
    label: i % step === 0 ? p.label : '',
  }));
  const packingData = visiblePoints.map((p) => ({ value: p.avgPacking }));

  const kpis = summary.kpis;
  const chartWidth = SCREEN_WIDTH - Spacing.md * 2 - Spacing.xl;

  if (chartPoints.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: c.surface }]}>
        <Text style={[styles.emptyText, { color: c.textMuted }]}>Sin datos de rendimiento</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* ── External header & stats ── */}
      <View style={styles.externalHeader}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleRow}>
            <MaterialCommunityIcons name="chart-line" size={14} color={c.textSecondary} />
            <Text style={[styles.listHeaderText, { color: c.textSecondary }]}>
              {title?.toUpperCase() ?? 'TENDENCIA DE RENDIMIENTO'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            {canZoom && (
              <TouchableOpacity
                onPress={() => setZoom72h((v) => !v)}
                style={[
                  styles.zoomBtn,
                  {
                    backgroundColor: zoom72h ? c.primary + '20' : 'transparent',
                    borderColor: zoom72h ? c.primary : c.border,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="clock-time-four-outline"
                  size={12}
                  color={zoom72h ? c.primary : c.textMuted}
                />
                <Text style={[styles.zoomBtnText, { color: zoom72h ? c.primary : c.textMuted }]}>
                  72h
                </Text>
              </TouchableOpacity>
            )}
            {onExpand && (
              <TouchableOpacity onPress={onExpand} style={styles.expandBtn}>
                <MaterialCommunityIcons name="arrow-expand" size={18} color={c.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statsGroupLeft}>
            <StatItem label="AVG"     value={`${kpis.avgTotal}%`}   color={c.text} />
            <StatItem label="FORMING" value={`${kpis.avgForming}%`} color="#6366f1" />
            <StatItem label="PACKING" value={`${kpis.avgPacking}%`} color="#10b981" />
          </View>
          <StatItem
            label="TREND"
            value={kpis.trend === 'up' ? '↑' : kpis.trend === 'down' ? '↓' : '→'}
            color={kpis.trend === 'up' ? c.success : kpis.trend === 'down' ? c.error : c.textMuted}
            align="flex-end"
          />
        </View>
      </View>

      {/* ── Chart card ── */}
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
            hideDataPoints={visiblePoints.length > 80}
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
            showVerticalLines={visiblePoints.length <= 50}
            verticalLinesColor={c.border}
            maxValue={100}
            noOfSections={5}
            yAxisLabelSuffix="%"
            isAnimated
            animationDuration={500}
            spacing={Math.max(8, (chartWidth - 40) / Math.max(formingData.length - 1, 1))}
            initialSpacing={10}
            endSpacing={10}
            pointerConfig={{
              pointerStripUptoDataPoint: true,
              pointerStripColor: 'rgba(99, 102, 241, 0.4)',
              pointerStripWidth: 2,
              pointerColor: '#6366f1',
              radius: 6,
              pointerLabelComponent: (items: any) => (
                <View style={styles.tooltip}>
                  <View style={styles.tooltipRow}>
                    <Text style={styles.tooltipF}>F</Text>
                    <Text style={styles.tooltipVal}>{items[0].value}%</Text>
                  </View>
                  <View style={styles.tooltipRow}>
                    <Text style={styles.tooltipP}>P</Text>
                    <Text style={styles.tooltipVal}>{items[1]?.value || 0}%</Text>
                  </View>
                </View>
              ),
            }}
          />
        </View>

        <View style={styles.footerRow}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#6366f1' }]} />
            <Text style={styles.legendText}>Forming</Text>
            <View style={[styles.legendDot, { backgroundColor: '#10b981', marginLeft: 10 }]} />
            <Text style={styles.legendText}>Packing</Text>
          </View>
          <Text style={[styles.recordCount, { color: c.textMuted }]}>
            {zoom72h && canZoom
              ? `${visiblePoints.length} pts · últ. 72h`
              : `${chartPoints.length} pts · campaña`}
          </Text>
        </View>
      </View>
    </View>
  );
}

function StatItem({
  label, value, color, align = 'flex-start',
}: {
  label: string; value: string; color: string; align?: 'flex-start' | 'flex-end' | 'center';
}) {
  return (
    <View style={[styles.statItem, { alignItems: align }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer:    { marginVertical: Spacing.md },
  externalHeader:   { paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  headerTopRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  headerTitleRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerActions:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  container:        { borderRadius: BorderRadius.md, padding: Spacing.md, marginHorizontal: Spacing.md, elevation: 1 },
  chartWrapper:     { alignItems: 'flex-start', overflow: 'hidden' },
  listHeaderText:   { ...Typography.label, fontSize: 10, color: '#9ba4ae' },
  expandBtn:        { padding: 4 },
  zoomBtn:          { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  zoomBtnText:      { fontSize: 10, fontWeight: '700' },
  statsRow:         { flexDirection: 'row', justifyContent: 'space-between', paddingTop: Spacing.xs },
  statsGroupLeft:   { flexDirection: 'row', gap: Spacing.lg },
  statItem:         { minWidth: 40 },
  statValue:        { ...Typography.title, fontSize: FontSize.lg, fontWeight: '800' },
  statLabel:        { ...Typography.label, fontSize: 8, color: '#9ba4ae', marginTop: 1 },
  legendRow:        { flexDirection: 'row', alignItems: 'center' },
  legendDot:        { width: 7, height: 7, borderRadius: 3.5 },
  legendText:       { fontSize: 9, fontWeight: '700', color: '#9ba4ae', marginLeft: 4 },
  footerRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.sm },
  recordCount:      { ...Typography.hint, fontSize: 9, fontWeight: '600' },
  empty:            { height: 160, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', marginHorizontal: Spacing.md },
  emptyText:        { ...Typography.caption },
  tooltip: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    padding: 8,
    borderRadius: 8,
    width: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    bottom: 40,
    left: -30,
    gap: 4,
  },
  tooltipRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tooltipF:   { fontSize: 10, color: '#818cf8', fontWeight: '700' },
  tooltipP:   { fontSize: 10, color: '#34d399', fontWeight: '700' },
  tooltipVal: { fontSize: 10, color: '#fff', fontWeight: '900' },
});
