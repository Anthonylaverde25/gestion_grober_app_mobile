import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';
import { CommonStyles } from '@/shared/theme/common-styles';
import { Typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: CommonStyles.flex1,
  badge: {
    ...CommonStyles.rowCenter,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    ...Typography.hint,
    fontWeight: '700',
  },
  infoStrip: {
    ...CommonStyles.rowCenter,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  infoItem: {
    flex: 1,
    ...CommonStyles.rowCenter,
    gap: 4,
    justifyContent: 'center',
  },
  infoText: {
    color: 'rgba(255,255,255,0.9)',
    ...Typography.hint,
    fontSize: 10,
    fontWeight: '600',
  },
  infoDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  kpiRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  kpiCard: {
    ...CommonStyles.card,
    flex: 1,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  kpiLabel: {
    ...Typography.label,
    fontSize: 8,
    marginBottom: 2,
  },
  kpiValue: {
    ...Typography.title,
    fontVariant: ['tabular-nums'],
  },
  center: {
    ...CommonStyles.center,
    gap: Spacing.sm,
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    ...Typography.caption,
    marginTop: Spacing.sm,
  },
});
