import { StyleSheet, Platform } from 'react-native';
import { Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { CommonStyles } from '@/shared/theme/common-styles';
import { Typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: {
    ...CommonStyles.flex1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  brandHeader: {
    height: '28%', // Reducido para mayor minimalismo
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.xl,
    borderBottomRightRadius: 60, // Cambio de dirección para un look más asimétrico y moderno
  },
  logoCircle: {
    width: 60, // Más pequeño y discreto
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  brandName: {
    ...Typography.header,
    color: '#ffffff',
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: '300', // Más delgado para minimalismo
    textTransform: 'uppercase',
  },
  brandSubtitle: {
    ...Typography.label,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 8,
    marginTop: 2,
    letterSpacing: 1.5,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    backgroundColor: 'transparent',
  },
  welcomeText: {
    ...Typography.title,
    fontSize: 22,
    marginBottom: 4,
  },
  instructionText: {
    ...Typography.caption,
    color: '#6a6d70',
    marginBottom: Spacing.xl,
    fontSize: 13,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.label,
    fontSize: 10,
    color: '#6a6d70',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    height: 48,
    fontSize: 14,
  },
  loginButton: {
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    height: 48,
    justifyContent: 'center',
  },
  loginButtonLabel: {
    ...Typography.subheader,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 1,
  },
  errorContainer: {
    ...CommonStyles.rowCenter,
    backgroundColor: '#fff5f5',
    padding: 12,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#bb0000',
  },
  errorText: {
    ...Typography.hint,
    color: '#bb0000',
    marginLeft: 8,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    ...Typography.hint,
    color: '#a0a0a0',
  },
  versionBadge: {
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  versionText: {
    ...Typography.hint,
    fontSize: 8,
    fontWeight: '700',
    color: '#6a6d70',
  }
});

// Required by Expo Router: every file inside /app must export a default.
// eslint-disable-next-line import/no-default-export
export default {};
