import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface StatKpiCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'stable';
}

export function StatKpiCard({ label, value, icon, color, suffix, trend }: StatKpiCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const accentColor = color ?? c.primary;

  const trendIcon =
    trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'minus';
  const trendColor =
    trend === 'up' ? c.success : trend === 'down' ? c.error : c.textMuted;

  return (
    <Surface style={[styles.card, { backgroundColor: c.surface }]}>
      {/* Top row: icon + trend */}
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: accentColor + '18' }]}>
          <MaterialCommunityIcons name={icon as any} size={18} color={accentColor} />
        </View>
        {trend && (
          <MaterialCommunityIcons name={trendIcon as any} size={16} color={trendColor} />
        )}
      </View>

      {/* Value */}
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: c.text }]}>{value}</Text>
        {suffix && <Text style={[styles.suffix, { color: c.textSecondary }]}>{suffix}</Text>}
      </View>

      {/* Label */}
      <Text style={[styles.label, { color: c.textSecondary }]} numberOfLines={2}>
        {label}
      </Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flex: 1,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    minWidth: 120,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    marginBottom: 2,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    lineHeight: FontSize.xl * 1.2,
  },
  suffix: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    marginBottom: 2,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    letterSpacing: 0.3,
    lineHeight: 15,
  },
});
