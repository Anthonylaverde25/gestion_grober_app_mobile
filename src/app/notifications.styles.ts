import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';
import { CommonStyles } from '@/shared/theme/common-styles';
import { Typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: CommonStyles.flex1,
  list: {
    paddingTop: Spacing.sm,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionLabel: Typography.label,
  alertCard: {
    ...CommonStyles.card,
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    elevation: 1,
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: { flex: 1 },
  alertTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  alertTitle: {
    ...Typography.subheader,
    flex: 1,
    marginRight: 8,
  },
  alertTime: {
    ...Typography.hint,
    fontSize: 10,
  },
  alertMessage: {
    ...Typography.hint,
    lineHeight: 16,
    fontWeight: '400',
  },
  emptyPast: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
});

// Required by Expo Router: every file inside /app must export a default.
// This file only provides styles; the dummy export silences the route warning.
// eslint-disable-next-line import/no-default-export
export default {};
