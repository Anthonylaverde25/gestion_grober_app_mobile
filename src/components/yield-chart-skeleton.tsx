import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Skeleton placeholder for the YieldLineChart while the summary is loading.
 * Matches the approximate dimensions of the real chart card.
 */
export function YieldChartSkeleton() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const base = scheme === 'dark' ? '#2a2a2a' : '#e2e8f0';
  const highlight = scheme === 'dark' ? '#3a3a3a' : '#cbd5e1';

  return (
    <View style={[styles.wrapper, { marginHorizontal: Spacing.md }]}>
      {/* Header row skeleton */}
      <View style={styles.headerRow}>
        <Animated.View style={[styles.pill, { backgroundColor: base, width: 140, opacity: pulse }]} />
        <Animated.View style={[styles.pill, { backgroundColor: base, width: 32, opacity: pulse }]} />
      </View>

      {/* Stats row skeleton */}
      <View style={styles.statsRow}>
        {[60, 80, 72].map((w, i) => (
          <Animated.View key={i} style={[styles.statBlock, { opacity: pulse }]}>
            <Animated.View style={[styles.statValue, { backgroundColor: base, width: w }]} />
            <Animated.View style={[styles.statLabel, { backgroundColor: highlight, width: w * 0.6 }]} />
          </Animated.View>
        ))}
      </View>

      {/* Chart area skeleton */}
      <Animated.View
        style={[
          styles.chartArea,
          { backgroundColor: base, opacity: pulse },
        ]}
      >
        {/* Simulated bar lines */}
        <View style={styles.bars}>
          {[65, 80, 55, 90, 70, 85, 60, 78, 92, 68, 75, 88].map((h, i) => (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  height: `${h}%`,
                  backgroundColor: highlight,
                  opacity: 0.5 + (i % 3) * 0.15,
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>

      {/* Footer skeleton */}
      <View style={styles.footer}>
        <Animated.View style={[styles.pill, { backgroundColor: base, width: 100, opacity: pulse }]} />
        <Animated.View style={[styles.pill, { backgroundColor: base, width: 70, opacity: pulse }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  statBlock: {
    gap: 4,
  },
  statValue: {
    height: 20,
    borderRadius: 4,
  },
  statLabel: {
    height: 10,
    borderRadius: 3,
  },
  chartArea: {
    height: 170,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: Spacing.sm,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: '80%',
  },
  bar: {
    flex: 1,
    borderRadius: 2,
  },
  pill: {
    height: 12,
    borderRadius: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
});
