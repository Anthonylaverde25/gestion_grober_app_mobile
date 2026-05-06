import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';
import { CommonStyles } from '@/shared/theme/common-styles';
import { Typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: CommonStyles.flex1,
  statsStrip: {
    ...CommonStyles.rowCenter,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#ffffff',
    ...Typography.title,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    ...Typography.hint,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginVertical: 2,
  },
  filterBar: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  sectionLabel: {
    ...Typography.label,
  },
  list: CommonStyles.listContent,
  center: {
    ...CommonStyles.center,
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    ...Typography.caption,
    marginTop: Spacing.sm,
  },
  errorText: {
    ...Typography.subheader,
    textAlign: 'center',
  },
  errorSub: {
    ...Typography.caption,
    textAlign: 'center',
  },
  emptyText: {
    ...Typography.caption,
    textAlign: 'center',
  },
  sectionStickyHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingTop: Spacing.md,
  },
  sectionBadge: {
    ...CommonStyles.rowCenter,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  sectionTitle: {
    ...Typography.label,
    fontSize: 10,
    letterSpacing: 1.5,
  },
});
