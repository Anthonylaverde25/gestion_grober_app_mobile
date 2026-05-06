import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { CommonStyles } from '@/shared/theme/common-styles';
import { Typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: Spacing.md,
  },
  listHeader: {
    ...CommonStyles.rowCenter,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    ...CommonStyles.rowCenter,
    gap: 6,
  },
  listHeaderText: Typography.label,
  expandBtn: {
    padding: 4,
  },
  recordItem: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  timeCol: {
    width: 50,
    alignItems: 'center',
    paddingTop: Spacing.xs,
  },
  timeText: {
    ...Typography.subheader,
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  dateText: {
    ...Typography.hint,
    fontSize: 9,
    color: '#9ba4ae',
  },
  contentCol: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  dataCard: {
    ...CommonStyles.card,
    padding: Spacing.sm,
    elevation: 1,
    shadowOpacity: 0.04,
  },
  operatorRow: {
    ...CommonStyles.rowCenter,
    gap: 4,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
    paddingBottom: 4,
  },
  operatorText: {
    ...Typography.hint,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricBlock: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    ...Typography.label,
    fontSize: 7,
    color: '#9ba4ae',
    marginBottom: 2,
  },
  metricValue: {
    ...Typography.title,
    fontSize: 15,
    fontVariant: ['tabular-nums'],
  },
  totalValue: {
    fontWeight: '800',
    fontSize: 16,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  emptyContainer: {
    ...CommonStyles.center,
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyText: Typography.caption,
  seeMoreBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  }
});
