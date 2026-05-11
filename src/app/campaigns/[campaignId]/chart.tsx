import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing } from '@/constants/theme';
import { useCampaignYieldSummary } from '@/features/admin/hooks/useCampaignYieldSummary';
import { LineChart } from 'react-native-gifted-charts';
import { YieldChartPoint } from '@/core/domain/entities';

const HOURS_72 = 72;
const Y_AXIS_WIDTH = 50;
const CHART_PADDING_H = 24; // left + right padding around chart area

export default function ChartDetailScreen() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const [availableWidth, setAvailableWidth] = useState(0);
  const [availableHeight, setAvailableHeight] = useState(0);
  const [zoom72h, setZoom72h] = useState(false);

  const { data: summary, isLoading } = useCampaignYieldSummary(campaignId);

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    lockOrientation();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const allPoints = summary?.chartPoints ?? [];
  const canZoom = allPoints.length > HOURS_72;

  const visiblePoints: YieldChartPoint[] = useMemo(() => {
    if (!zoom72h || !canZoom) return allPoints;
    return allPoints.slice(-HOURS_72);
  }, [allPoints, zoom72h, canZoom]);

  // ── Chart sizing logic ──────────────────────────────────────────────────
  // The chart must feel expansive. We compute the ideal spacing per point
  // based on the available width. If points exceed what fits comfortably,
  // we enable horizontal scrolling with a generous minimum spacing.
  const dataCount = visiblePoints.length;
  const usableWidth = Math.max(availableWidth - Y_AXIS_WIDTH - CHART_PADDING_H, 300);

  // Ideal spacing: fill the entire available width
  const idealSpacing = dataCount > 1 ? usableWidth / (dataCount - 1) : usableWidth;
  // Minimum comfortable spacing (ensures readability and touch targets)
  const MIN_SPACING = 12;
  // Use the larger of ideal vs minimum — if ideal is wide enough, no scroll needed
  const spacing = Math.max(idealSpacing, MIN_SPACING);
  // Total chart width: if spacing > ideal, the chart overflows and scrolls
  const chartContentWidth = dataCount > 1
    ? (dataCount - 1) * spacing
    : usableWidth;
  // The gifted-charts `width` prop = content width (without yAxis)
  const chartWidth = Math.max(chartContentWidth, usableWidth);
  // Determine if scroll is needed
  const needsScroll = chartWidth > usableWidth;

  // Labels: show every Nth label to avoid overlap
  const step = Math.max(1, Math.ceil(dataCount / 20));
  const formingData = visiblePoints.map((p, i) => ({
    value: p.avgForming,
    label: i % step === 0 ? p.label : '',
  }));
  const packingData = visiblePoints.map((p) => ({ value: p.avgPacking }));

  const kpis = summary?.kpis;
  const avgForming = kpis?.avgForming ?? 0;
  const avgPacking = kpis?.avgPacking ?? 0;
  const avgTotal   = kpis?.avgTotal   ?? 0;

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['left', 'right', 'bottom']}>
      <StatusBar hidden />
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Compact Professional Header ── */}
      <View style={[styles.header, { borderBottomColor: c.border, backgroundColor: c.surface }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <MaterialCommunityIcons name="close" size={20} color={c.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: c.text }]}>ANÁLISIS COMPARATIVO</Text>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#6366f1' }]} />
              <Text style={styles.legendLabel}>Forming</Text>
              <View style={[styles.legendDot, { backgroundColor: '#10b981', marginLeft: 10 }]} />
              <Text style={styles.legendLabel}>Packing</Text>
            </View>
          </View>
        </View>

        {/* Center: zoom toggle */}
        <View style={styles.headerCenter}>
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
                name={zoom72h ? 'clock-time-four-outline' : 'chart-timeline-variant-shimmer'}
                size={13}
                color={zoom72h ? c.primary : c.textMuted}
              />
              <Text style={[styles.zoomBtnText, { color: zoom72h ? c.primary : c.textMuted }]}>
                {zoom72h ? 'Últimas 72h' : 'Campaña completa'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Right: KPIs */}
        <View style={styles.kpiRow}>
          <MiniKpi label="AVG"     value={`${avgTotal}%`}   color={c.text} />
          <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
          <MiniKpi label="FORMING" value={`${avgForming}%`} color="#6366f1" />
          <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
          <MiniKpi label="PACKING" value={`${avgPacking}%`} color="#10b981" />
          <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
          <MiniKpi
            label={zoom72h && canZoom ? '72h' : 'TOTAL'}
            value={`${visiblePoints.length} pts`}
            color={c.textMuted}
          />
        </View>
      </View>

      {/* ── Full-Bleed Chart Area ── */}
      <View
        style={styles.chartArea}
        onLayout={(e) => {
          setAvailableWidth(e.nativeEvent.layout.width);
          setAvailableHeight(e.nativeEvent.layout.height);
        }}
      >
        {availableHeight > 0 && availableWidth > 0 && formingData.length > 0 && (
          <ScrollView
            horizontal={needsScroll}
            scrollEnabled={needsScroll}
            showsHorizontalScrollIndicator={needsScroll}
            bounces={false}
            style={styles.chartScroll}
            contentContainerStyle={[
              styles.chartContent,
              !needsScroll && { flex: 1 },
            ]}
          >
            <LineChart
              data={formingData}
              data2={packingData}
              width={chartWidth}
              height={availableHeight - 50}
              color="#6366f1"
              color2="#10b981"
              thickness={2.5}
              thickness2={2.5}
              areaChart
              curved
              startFillColor="rgba(99, 102, 241, 0.18)"
              startFillColor2="rgba(16, 185, 129, 0.18)"
              endFillColor="rgba(99, 102, 241, 0.02)"
              endFillColor2="rgba(16, 185, 129, 0.02)"
              xAxisColor={c.border}
              yAxisColor={c.border}
              xAxisLabelTextStyle={{ color: c.textMuted, fontSize: 9, fontWeight: '600' }}
              yAxisTextStyle={{ color: c.textMuted, fontSize: 10, fontWeight: '600' }}
              rulesColor={c.border + '40'}
              rulesType="dashed"
              showVerticalLines
              verticalLinesColor={c.border + '25'}
              verticalLinesThickness={1}
              verticalLinesStrokeDashArray={[3, 6]}
              maxValue={100}
              noOfSections={5}
              yAxisLabelSuffix="%"
              isAnimated
              animationDuration={600}
              spacing={spacing}
              initialSpacing={16}
              endSpacing={24}
              yAxisLabelContainerStyle={{ width: Y_AXIS_WIDTH }}
              hideDataPoints={dataCount > 150}
              dataPointsColor="#6366f1"
              dataPointsColor2="#10b981"
              dataPointsRadius={dataCount > 80 ? 2.5 : 4}
              dataPointsRadius2={dataCount > 80 ? 2.5 : 4}
              pointerConfig={{
                pointerStripUptoDataPoint: true,
                pointerStripColor: 'rgba(99, 102, 241, 0.35)',
                pointerStripWidth: 1.5,
                strokeDashArray: [3, 4],
                pointerColor: '#6366f1',
                radius: 6,
                pointerLabelComponent: (items: any) => (
                  <View style={styles.tooltip}>
                    {items[0].label ? (
                      <Text style={styles.tooltipTime}>{items[0].label}</Text>
                    ) : null}
                    <View style={styles.tooltipRow}>
                      <View style={[styles.tooltipDot, { backgroundColor: '#818cf8' }]} />
                      <Text style={styles.tooltipLabel}>Forming</Text>
                      <Text style={styles.tooltipValue}>{items[0].value}%</Text>
                    </View>
                    <View style={styles.tooltipRow}>
                      <View style={[styles.tooltipDot, { backgroundColor: '#34d399' }]} />
                      <Text style={styles.tooltipLabel}>Packing</Text>
                      <Text style={styles.tooltipValue}>{items[1]?.value || 0}%</Text>
                    </View>
                  </View>
                ),
              }}
            />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

function MiniKpi({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.miniKpi}>
      <Text style={styles.miniKpiLabel}>{label}</Text>
      <Text style={[styles.miniKpiValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  closeBtn: { padding: 6 },
  headerTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },

  legendRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  legendDot:  { width: 7, height: 7, borderRadius: 3.5 },
  legendLabel:{ fontSize: 9, fontWeight: '700', color: '#9ba4ae', marginLeft: 4 },

  zoomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  zoomBtnText: { fontSize: 11, fontWeight: '700' },

  kpiRow:     { flexDirection: 'row', alignItems: 'center', gap: 16 },
  kpiDivider: { width: 1, height: 14 },
  miniKpi:      { alignItems: 'center' },
  miniKpiLabel: { fontSize: 8, fontWeight: '700', color: '#9ba4ae', marginBottom: 1 },
  miniKpiValue: { fontSize: 13, fontWeight: '900', fontVariant: ['tabular-nums'] },

  // ── Chart ──
  chartArea: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  chartScroll: { flex: 1 },
  chartContent: {
    paddingBottom: 12,
  },

  // ── Tooltip ──
  tooltip: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    width: 140,
    bottom: 50,
    left: -60,
    gap: 5,
  },
  tooltipTime: { fontSize: 10, fontWeight: '800', color: '#64748b', textAlign: 'center', marginBottom: 4 },
  tooltipRow:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tooltipDot:  { width: 6, height: 6, borderRadius: 3 },
  tooltipLabel:{ fontSize: 10, fontWeight: '600', color: '#94a3b8', flex: 1 },
  tooltipValue:{ fontSize: 11, fontWeight: '900', color: '#fff' },
});
