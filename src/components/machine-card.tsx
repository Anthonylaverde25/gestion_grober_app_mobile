import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Machine } from '@/core/domain/entities';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface MachineCardProps {
  machine: Machine;
  campaignCount?: number;
  onPress?: () => void;
}

const STATUS_CONFIG = {
  active: { label: 'ACTIVO', color: '#107e3e', bg: '#f0faf4', icon: 'fire' as const },
  inactive: { label: 'INACTIVO', color: '#6a6d70', bg: '#f5f6f7', icon: 'fire-off' as const },
  maintenance: { label: 'MANTENIMIENTO', color: '#e9730c', bg: '#fff5e5', icon: 'wrench-outline' as const },
};

export function MachineCard({ machine, campaignCount, onPress }: MachineCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const statusKey = machine.status || 'active';
  const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.active;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Surface style={[styles.card, { backgroundColor: c.surface }]}>
        {/* Icon */}
        <View style={[styles.iconBox, { backgroundColor: status.bg }]}>
          <MaterialCommunityIcons name={status.icon} size={22} color={status.color} />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>
              {machine.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>
          <Text style={[styles.code, { color: c.textSecondary }]}>
            Código: {machine.code}
          </Text>
          {campaignCount !== undefined && (
            <Text style={[styles.campaigns, { color: c.textMuted }]}>
              {campaignCount} campaña{campaignCount !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        <MaterialCommunityIcons name="chevron-right" size={20} color={c.textMuted} />
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    gap: Spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  name: {
    fontSize: FontSize.base,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  code: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  campaigns: {
    fontSize: FontSize.xs,
  },
});
