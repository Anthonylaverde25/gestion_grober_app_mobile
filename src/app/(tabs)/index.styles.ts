import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { CommonStyles } from '@/shared/theme/common-styles';
import { Typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: CommonStyles.flex1,
  headerStripContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerStrip: {
    flexDirection: 'row',
    gap: 4,
  },
  stripBar: {
    flex: 1,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  section: CommonStyles.section,
  sectionRow: CommonStyles.sectionRow,
  sectionLabel: {
    ...Typography.label,
    marginBottom: Spacing.sm,
  },
  seeAll: {
    ...Typography.caption,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickCard: {
    ...CommonStyles.card,
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLabel: {
    ...Typography.hint,
    fontWeight: '600',
    textAlign: 'center',
  },
  previewCard: {
    ...CommonStyles.card,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
    elevation: 1,
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  previewName: {
    ...Typography.subheader,
    flex: 1,
  },
  previewMeta: {
    ...Typography.hint,
  },
});

// Required by Expo Router: every file inside /app must export a default.
// eslint-disable-next-line import/no-default-export
export default {};
