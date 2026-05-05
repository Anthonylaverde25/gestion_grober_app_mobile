import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Campaign } from '@/core/domain/entities';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CampaignCardProps {
  campaign: Campaign;
  onPress?: () => void;
}

const STATUS_MAP = {
  active: { label: 'ACTIVA', color: '#107e3e', bg: '#f0faf4' },
  completed: { label: 'COMPLETADA', color: '#6a6d70', bg: '#f5f6f7' },
  paused: { label: 'PAUSADA', color: '#e9730c', bg: '#fff5e5' },
};

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function CampaignCard({ campaign, onPress }: CampaignCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const status = STATUS_MAP[campaign.status] ?? STATUS_MAP.active;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Surface style={[styles.card, { backgroundColor: c.surface }]}>
        {/* Header row */}
        <View style={styles.header}>
          <View style={styles.numberRow}>
            <MaterialCommunityIcons name="tag-outline" size={14} color={c.primary} />
            <Text style={[styles.number, { color: c.primary }]}>
              #{campaign.campaignNumber}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        {/* Machine, Article & Client */}
        <View style={styles.body}>
          {campaign.machineName && (
            <View style={styles.row}>
              <MaterialCommunityIcons name="fire" size={13} color={c.warning} />
              <Text style={[styles.label, { color: c.text, fontWeight: '600' }]}>  {campaign.machineName}</Text>
            </View>
          )}
          {campaign.articleName && (
            <View style={styles.row}>
              <MaterialCommunityIcons name="cube-outline" size={13} color={c.textSecondary} />
              <Text style={[styles.label, { color: c.textSecondary }]}>  {campaign.articleName}</Text>
            </View>
          )}
          {campaign.clientName && (
            <View style={styles.row}>
              <MaterialCommunityIcons name="domain" size={13} color={c.textSecondary} />
              <Text style={[styles.label, { color: c.textSecondary }]}>  {campaign.clientName}</Text>
            </View>
          )}
        </View>

        {/* Date footer */}
        <View style={[styles.footer, { borderTopColor: c.divider }]}>
          <Text style={[styles.date, { color: c.textMuted }]}>
            Inicio: {formatDate(campaign.startDate)}
          </Text>
          {campaign.endDate && (
            <Text style={[styles.date, { color: c.textMuted }]}>
              Fin: {formatDate(campaign.endDate)}
            </Text>
          )}
          <View style={{ flex: 1 }} />
          <MaterialCommunityIcons name="chart-line" size={16} color={c.primary} />
          <Text style={[styles.yieldLink, { color: c.primary }]}>
            {campaign.totalYieldRecords ?? 0} Registros
          </Text>
        </View>
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    fontSize: FontSize.base,
    fontWeight: '700',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  body: {
    gap: 4,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
    gap: 6,
  },
  date: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  yieldLink: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
});
