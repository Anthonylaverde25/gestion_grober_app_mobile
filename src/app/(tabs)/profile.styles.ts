import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { CommonStyles } from '@/shared/theme/common-styles';
import { Typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: CommonStyles.flex1,
  profileHeader: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: Typography.display,
  profileName: {
    ...Typography.header,
    color: '#ffffff',
  },
  roleBadge: {
    ...CommonStyles.rowCenter,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  roleText: {
    ...Typography.label,
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
  },
  section: CommonStyles.section,
  sectionLabel: {
    ...Typography.label,
    marginBottom: Spacing.sm,
  },
  infoCard: {
    ...CommonStyles.card,
    padding: 0,
    overflow: 'hidden',
  },
  infoRow: {
    ...CommonStyles.rowCenter,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: { flex: 1 },
  infoLabel: {
    ...Typography.hint,
    marginBottom: 2,
  },
  infoValue: Typography.subheader,
  companyRow: {
    ...CommonStyles.card,
    ...CommonStyles.rowCenter,
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
    elevation: 1,
  },
  companyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  companyName: Typography.subheader,
  logoutBtn: {
    ...CommonStyles.rowCenter,
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  logoutText: {
    ...Typography.subheader,
    letterSpacing: 0.5,
  },
});
