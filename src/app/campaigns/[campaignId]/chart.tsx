import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useCampaignYieldSummary } from '@/features/admin/hooks/useCampaignYieldSummary';
import { LineChart } from 'react-native-gifted-charts';

const Y_AXIS_WIDTH = 50;
const INITIAL_SP = 12;
const END_SP = 12;
const HEADER_HEIGHT = 52;

export default function ChartDetailScreen() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  // ── Responsive dimensions — listen to real orientation changes ─────────
  const [dims, setDims] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return {
      width: Math.max(width, height),
      height: Math.min(width, height),
    };
  });

  useEffect(() => {
    const onChange = ({ window }: { window: { width: number; height: number } }) => {
      setDims({ width: window.width, height: window.height });
    };
    const sub = Dimensions.addEventListener('change', onChange);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const { data: summary, isLoading } = useCampaignYieldSummary(campaignId);

  // ── Chart data ────────────────────────────────────────────────────────
  const chartPoints = summary?.chartPoints ?? [];
  const dataCount = chartPoints.length;

  // ── Chart sizing — full-bleed ─────────────────────────────────────────
  const chartAreaHeight = Math.max(dims.height - HEADER_HEIGHT - 20, 150);
  const usableWidth = Math.max(dims.width - Y_AXIS_WIDTH, 300);
  const spacing = dataCount > 1
    ? (usableWidth - INITIAL_SP - END_SP) / (dataCount - 1)
    : usableWidth;

  // X-axis labels: with ≤24 points in landscape, show every label.
  const formingData = useMemo(
    () => chartPoints.map((p) => ({
      value: p.avgForming,
      label: p.timeLabel,
    })),
    [chartPoints]
  );
  const packingData = useMemo(
    () => chartPoints.map((p) => ({ value: p.avgPacking })),
    [chartPoints]
  );

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
    <SafeAreaView
      style={[styles.container, { backgroundColor: c.background }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar hidden />
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Compact Professional Header ── */}
      <View style={[styles.header, { borderBottomColor: c.border, backgroundColor: c.surface }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <MaterialCommunityIcons name="close" size={20} color={c.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: c.text }]}>ANÁLISIS COMPARATIVO · ÚLT. 24H</Text>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#6366f1' }]} />
              <Text style={styles.legendLabel}>Forming</Text>
              <View style={[styles.legendDot, { backgroundColor: '#10b981', marginLeft: 10 }]} />
              <Text style={styles.legendLabel}>Packing</Text>
            </View>
          </View>
        </View>

        <View style={styles.kpiRow}>
          <MiniKpi label="AVG"     value={`${avgTotal}%`}   color={c.text} />
          <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
          <MiniKpi label="FORMING" value={`${avgForming}%`} color="#6366f1" />
          <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
          <MiniKpi label="PACKING" value={`${avgPacking}%`} color="#10b981" />
          <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
          <MiniKpi label="PUNTOS" value={`${dataCount}`} color={c.textMuted} />
        </View>
      </View>

      {/* ── Full-Bleed Chart Area ── */}
      {formingData.length > 0 && (
        <View style={styles.chartArea}>
          <LineChart
            data={formingData}
            data2={packingData}
            width={usableWidth}
            height={chartAreaHeight - 40}
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
            initialSpacing={INITIAL_SP}
            endSpacing={END_SP}
            yAxisLabelContainerStyle={{ width: Y_AXIS_WIDTH }}
            dataPointsColor="#6366f1"
            dataPointsColor2="#10b981"
            dataPointsRadius={4}
            dataPointsRadius2={4}
            pointerConfig={{
              pointerStripUptoDataPoint: true,
              pointerStripColor: 'rgba(99, 102, 241, 0.35)',
              pointerStripWidth: 1.5,
              strokeDashArray: [3, 4],
              pointerColor: '#6366f1',
              radius: 6,
              pointerLabelComponent: (items: any) => {
                // Find the matching chart point by value to show date in tooltip
                const idx = chartPoints.findIndex(
                  (p) => p.avgForming === items[0].value
                );
                const point = idx >= 0 ? chartPoints[idx] : null;
                return (
                  <View style={styles.tooltip}>
                    {point && (
                      <Text style={styles.tooltipTime}>
                        {point.dateLabel} · {point.timeLabel}
                      </Text>
                    )}
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
                );
              },
            }}
          />
        </View>
      )}
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
  closeBtn: { padding: 6 },
  headerTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },

  legendRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  legendDot:  { width: 7, height: 7, borderRadius: 3.5 },
  legendLabel:{ fontSize: 9, fontWeight: '700', color: '#9ba4ae', marginLeft: 4 },

  kpiRow:     { flexDirection: 'row', alignItems: 'center', gap: 16 },
  kpiDivider: { width: 1, height: 14 },
  miniKpi:      { alignItems: 'center' },
  miniKpiLabel: { fontSize: 8, fontWeight: '700', color: '#9ba4ae', marginBottom: 1 },
  miniKpiValue: { fontSize: 13, fontWeight: '900', fontVariant: ['tabular-nums'] },

  // ── Chart ──
  chartArea: {
    flex: 1,
    paddingTop: 4,
  },

  // ── Tooltip ──
  tooltip: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    width: 150,
    bottom: 50,
    left: -65,
    gap: 5,
  },
  tooltipTime: { fontSize: 10, fontWeight: '800', color: '#64748b', textAlign: 'center', marginBottom: 4 },
  tooltipRow:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tooltipDot:  { width: 6, height: 6, borderRadius: 3 },
  tooltipLabel:{ fontSize: 10, fontWeight: '600', color: '#94a3b8', flex: 1 },
  tooltipValue:{ fontSize: 11, fontWeight: '900', color: '#fff' },
});
