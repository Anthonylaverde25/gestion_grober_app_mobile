import { StyleSheet } from 'react-native';
import { Spacing } from '@/constants/theme';
import { CommonStyles } from '@/shared/theme/common-styles';
import { Typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: CommonStyles.flex1,
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
});
