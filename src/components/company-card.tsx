import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Company } from '@/core/domain/entities';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CompanyCardProps {
  company: Company;
  onPress?: () => void;
}

export function CompanyCard({ company, onPress }: CompanyCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const initials = company.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Surface style={[styles.card, { backgroundColor: c.surface, shadowColor: c.shadow }]}>
        {/* Left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: c.primary }]} />

        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: c.primary + '18' }]}>
          <Text style={[styles.initials, { color: c.primary }]}>{initials}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>
            {company.name}
          </Text>
          <View style={styles.metaRow}>
            {company.country && (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="map-marker-outline" size={12} color={c.textSecondary} />
                <Text style={[styles.metaText, { color: c.textSecondary }]}> {company.country}</Text>
              </View>
            )}
            {company.machinesCount !== undefined && (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="fire" size={12} color={c.textSecondary} />
                <Text style={[styles.metaText, { color: c.textSecondary }]}>
                  {' '}{company.machinesCount} hornos
                </Text>
              </View>
            )}
          </View>
          {company.activeCampaignsCount !== undefined && (
            <View style={[styles.badge, { backgroundColor: company.activeCampaignsCount > 0 ? c.success + '18' : c.textMuted + '18' }]}>
              <View style={[styles.dot, { backgroundColor: company.activeCampaignsCount > 0 ? c.success : c.textMuted }]} />
              <Text style={[styles.badgeText, { color: company.activeCampaignsCount > 0 ? c.success : c.textMuted }]}>
                {company.activeCampaignsCount} campañas activas
              </Text>
            </View>
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
    overflow: 'hidden',
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    padding: Spacing.md,
    paddingLeft: 0,
  },
  accentBar: {
    width: 3,
    alignSelf: 'stretch',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  initials: {
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.base,
    fontWeight: '600',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});
