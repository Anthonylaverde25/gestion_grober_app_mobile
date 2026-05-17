import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { TamaguiProvider } from 'tamagui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import tamaguiConfig from '@/shared/theme/tamagui.config';
import { initDatabase } from '@/infrastructure/persistence/sqlite';
import { useAuthStore } from '@/infrastructure/store/auth-store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// SAP Fiori Horizon Paper theme override
const paperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1e293b',
    secondary: '#107e3e',
    surface: '#ffffff',
    background: '#f5f6f7',
    error: '#bb0000',
    onPrimary: '#ffffff',
    outline: '#d9d9d9',
  },
};

const paperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#3b82f6',
    secondary: '#1db862',
    surface: '#1c2733',
    background: '#12171c',
    error: '#e85353',
    onPrimary: '#ffffff',
    outline: '#2e3b47',
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const token = useAuthStore((state) => state.token);
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    initDatabase().catch((err) => console.error('Failed to init DB', err));
  }, []);

  useEffect(() => {
    if (!navigationState?.key) return;
    const timeout = setTimeout(() => {
      const inAuthGroup = segments[0] === 'login';
      if (!token && !inAuthGroup) {
        router.replace('/login');
      } else if (token && inAuthGroup) {
        router.replace('/(tabs)');
      }
    }, 1);
    return () => clearTimeout(timeout);
  }, [token, segments, navigationState?.key]);

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={isDark ? 'dark' : 'light'}>
        <PaperProvider theme={isDark ? paperDarkTheme : paperLightTheme}>
          <ThemeProvider value={isDark ? NavigationDarkTheme : NavigationDefaultTheme}>
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="notifications" options={{ presentation: 'modal', title: 'Alertas' }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style={isDark ? 'light' : 'dark'} />
          </ThemeProvider>
        </PaperProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
