import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Text, ActivityIndicator, IconButton, Surface, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useCampaignYields } from '@/features/admin/hooks/useCampaignYields';
import { LineChart } from 'react-native-gifted-charts';

export default function ChartDetailScreen() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const [availableHeight, setAvailableHeight] = React.useState(0);
  const { data: yields, isLoading, stats } = useCampaignYields(campaignId);

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    lockOrientation();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  const formingData = yields?.map((r, i) => ({
    value: r.formingYield ?? 0,
    label: yields.length <= 25 ?
      new Date(r.reportedAt).getHours() + ':' + new Date(r.reportedAt).getMinutes().toString().padStart(2, '0') :
      (i % Math.ceil(yields.length / 15) === 0 ?
        new Date(r.reportedAt).getHours() + ':' + new Date(r.reportedAt).getMinutes().toString().padStart(2, '0') :
        ''),
  })) || [];

  const packingData = yields?.map((r) => ({
    value: r.packingYield ?? 0,
  })) || [];

  const windowWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['left', 'right', 'bottom']}>
      <StatusBar hidden />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Ultra-Minimalist Top Header */}
      <View style={[styles.minimalHeader, { borderBottomColor: c.border, backgroundColor: c.surface }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.miniCloseBtn}>
            <MaterialCommunityIcons name="close" size={20} color={c.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.miniTitle, { color: c.text }]}>ANÁLISIS COMPARATIVO</Text>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: c.primary }]} /><Text style={styles.legendText}>Forming</Text>
              <View style={[styles.legendDot, { backgroundColor: c.success, marginLeft: 8 }]} /><Text style={styles.legendText}>Packing</Text>
            </View>
          </View>
        </View>

        <View style={styles.kpiRow}>
          <MiniKpi label="AVG" value={`${stats?.average.toFixed(1)}%`} color={c.text} />
          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <MiniKpi label="FORMING" value={`${(yields?.reduce((acc, r) => acc + (r.formingYield || 0), 0) / (yields?.length || 1)).toFixed(1)}%`} color={c.primary} />
          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <MiniKpi label="PACKING" value={`${(yields?.reduce((acc, r) => acc + (r.packingYield || 0), 0) / (yields?.length || 1)).toFixed(1)}%`} color={c.success} />
        </View>
      </View>

      {/* Full Width Chart Area */}
      <View
        style={styles.chartArea}
        onLayout={(e) => setAvailableHeight(e.nativeEvent.layout.height)}
      >
        {availableHeight > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.chartScroll}>
            <View style={styles.chartContainer}>
                <LineChart
                  data={formingData}
                  data2={packingData}
                  width={Math.max(windowWidth - 70, formingData.length * 80)}
                  height={availableHeight - 70}
                  color="rgba(99, 102, 241, 0.7)" 
                  color2="rgba(16, 185, 129, 0.7)"
                  thickness={3}
                  thickness2={3}
                  areaChart
                  curved
                  startFillColor="rgba(99, 102, 241, 0.15)"
                  startFillColor2="rgba(16, 185, 129, 0.15)"
                  endFillColor="transparent"
                  endFillColor2="transparent"
                  xAxisColor={c.border}
                  yAxisColor={c.border}
                  xAxisLabelTextStyle={{ color: c.textMuted, fontSize: 10, fontWeight: '700' }}
                  yAxisTextStyle={{ color: c.textMuted, fontSize: 10, fontWeight: '700' }}
                  rulesColor={c.border}
                  rulesType="dashed"
                  showVerticalLines={true}
                  verticalLinesColor={c.border}
                  verticalLinesThickness={1}
                  verticalLinesStrokeDashArray={[4, 4]}
                  maxValue={100}
                  noOfSections={5}
                  yAxisLabelSuffix="%"
                  isAnimated
                  animationDuration={1000}
                  spacing={80}
                  initialSpacing={10}
                  endSpacing={20}
                  yAxisLabelContainerStyle={{ width: 45 }}
                  hideDataPoints={false}
                  dataPointsColor="rgba(99, 102, 241, 0.8)"
                  dataPointsColor2="rgba(16, 185, 129, 0.8)"
                  dataPointsRadius={4}
                  dataPointsRadius2={4}
                  pointerConfig={{
                    pointerStripUptoDataPoint: true,
                    pointerStripColor: 'rgba(99, 102, 241, 0.4)',
                    pointerStripWidth: 2,
                    strokeDashArray: [2, 5],
                    pointerColor: 'rgba(99, 102, 241, 1)',
                    radius: 7,
                    pointerLabelComponent: (items: any) => {
                      return (
                        <View style={{
                          backgroundColor: 'rgba(30, 41, 59, 0.95)',
                          padding: 12,
                          borderRadius: 12,
                          width: 130,
                          borderWidth: 1,
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          bottom: 50,
                          left: -55,
                        }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: '#94a3b8', marginBottom: 8, textAlign: 'center' }}>
                            {items[0].label}
                          </Text>
                          <View style={{ gap: 6 }}>
                             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                               <Text style={{ fontSize: 11, color: 'rgba(99, 102, 241, 1)', fontWeight: '700' }}>Forming</Text>
                               <Text style={{ fontSize: 11, color: '#fff', fontWeight: '900' }}>{items[0].value}%</Text>
                             </View>
                             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                               <Text style={{ fontSize: 11, color: 'rgba(16, 185, 129, 1)', fontWeight: '700' }}>Packing</Text>
                               <Text style={{ fontSize: 11, color: '#fff', fontWeight: '900' }}>{items[1]?.value || 0}%</Text>
                             </View>
                          </View>
                        </View>
                      );
                    },
                  }}
                />
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

function MiniKpi({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <View style={styles.miniKpi}>
      <Text style={styles.miniKpiLabel}>{label}</Text>
      <Text style={[styles.miniKpiValue, { color }]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  minimalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniCloseBtn: {
    padding: 4,
  },
  miniTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#9ba4ae',
    marginLeft: 4,
  },
  kpiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  miniKpi: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  miniKpiLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#9ba4ae',
  },
  miniKpiValue: {
    fontSize: 14,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  divider: {
    width: 1,
    height: 12,
  },
  chartArea: {
    flex: 1,
  },
  chartScroll: {
    flex: 1,
  },
  chartContainer: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 280,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 4,
    backgroundColor: '#0f172a',
  },
  modalTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
  },
  modalBody: {
    padding: 20,
  },
  modalTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'center',
  },
  modalTimeText: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '700',
  },
  modalKpiGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  modalKpiCard: {
    flex: 1,
    backgroundColor: '#334155',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalKpiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  modalKpiLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94a3b8',
    marginBottom: 4,
  },
  modalKpiValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  }
});
