import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';
import { CommonStyles } from '@/shared/theme/common-styles';
import { Typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: CommonStyles.flex1,
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    ...Typography.hint,
    fontWeight: '700',
  },
  strip: {
    ...CommonStyles.rowCenter,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  stripItem: {
    ...CommonStyles.rowCenter,
    gap: 6,
  },
  stripText: {
    ...Typography.hint,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  stripDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  sectionLabel: Typography.label,
  list: CommonStyles.listContent,
  center: {
    ...CommonStyles.center,
    gap: Spacing.sm,
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    ...Typography.caption,
    marginTop: Spacing.sm,
  },
  errorText: Typography.subheader,
  emptyText: {
    ...Typography.caption,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});

// Required by Expo Router: every file inside /app must export a default.
// eslint-disable-next-line import/no-default-export
export default {};
