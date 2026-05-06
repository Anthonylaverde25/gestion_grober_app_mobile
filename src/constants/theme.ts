// ─── SAP Fiori Horizon — Industrial Design System ────────────────────────────
// Mirrors the web frontend palette for brand consistency.

export const Colors = {
  light: {
    primary: '#1d576d',
    primaryDark: '#164354',
    background: '#f5f6f7',
    surface: '#ffffff',
    text: '#1d2d3e',
    textSecondary: '#6a6d70',
    textMuted: '#a0a0a0',
    border: '#d9d9d9',
    success: '#107e3e',
    successLight: '#f0faf4',
    warning: '#e9730c',
    warningLight: '#fff5e5',
    error: '#bb0000',
    errorLight: '#fff5f5',
    tint: '#1d576d',
    icon: '#6a6d70',          // legacy compat
    tabIconDefault: '#a0a0a0',
    tabIconSelected: '#1d576d',
    divider: '#e5e5e5',
    shadow: 'rgba(0,0,0,0.08)',
    overlay: 'rgba(0,0,0,0.4)',
    chart: {
      primary: '#1d576d',
      secondary: '#107e3e',
      tertiary: '#e9730c',
      grid: '#e5e5e5',
    },
  },
  dark: {
    primary: '#4ba6fb',
    primaryDark: '#0070f2',
    background: '#12171c',
    surface: '#1c2733',
    text: '#e8eaed',
    textSecondary: '#9ba4ae',
    textMuted: '#606670',
    border: '#2e3b47',
    success: '#1db862',
    successLight: '#0e2a1a',
    warning: '#f0922b',
    warningLight: '#2a1a00',
    error: '#e85353',
    errorLight: '#2a0d0d',
    tint: '#4ba6fb',
    icon: '#9ba4ae',          // legacy compat
    tabIconDefault: '#606670',
    tabIconSelected: '#4ba6fb',
    divider: '#2e3b47',
    shadow: 'rgba(0,0,0,0.3)',
    overlay: 'rgba(0,0,0,0.6)',
    chart: {
      primary: '#4ba6fb',
      secondary: '#1db862',
      tertiary: '#f0922b',
      grid: '#2e3b47',
    },
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 36,
};

export const BorderRadius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  full: 9999,
};

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;

// ── Font families (backward compat) ──────────────────────────────────────────
export const Fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  mono: 'SpaceMono',
  rounded: 'System',
};
