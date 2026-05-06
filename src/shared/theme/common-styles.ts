import { ViewStyle, StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';

export const CommonStyles = {
  flex1: {
    flex: 1,
  } as ViewStyle,
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  } as ViewStyle,
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  } as ViewStyle,
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  } as ViewStyle,
  card: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  } as ViewStyle,
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  listContent: {
    paddingBottom: Spacing.xxl,
  } as ViewStyle,
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
};
