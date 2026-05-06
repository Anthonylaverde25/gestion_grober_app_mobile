import { TextStyle } from 'react-native';
import { FontSize } from '@/constants/theme';

export const Typography = {
  display: {
    fontSize: FontSize.display,
    fontWeight: '700',
    letterSpacing: 0.2,
  } as TextStyle,
  header: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    letterSpacing: 0.3,
  } as TextStyle,
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    letterSpacing: 0.2,
  } as TextStyle,
  subheader: {
    fontSize: FontSize.base,
    fontWeight: '600',
    letterSpacing: 0.1,
  } as TextStyle,
  body: {
    fontSize: FontSize.base,
    fontWeight: '400',
  } as TextStyle,
  caption: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    letterSpacing: 0.3,
  } as TextStyle,
  label: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  } as TextStyle,
  hint: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    letterSpacing: 0.5,
  } as TextStyle,
};
