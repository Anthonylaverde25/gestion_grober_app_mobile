import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

/**
 * This Stack layout wraps all nested routes inside the "companies" segment.
 * Expo Router will use this for:
 *  - companies/index   (rendered by companies.tsx at tab level - handled by tab)
 *  - companies/[companyId]
 *  - companies/[companyId]/machine/[machineId]
 */
export default function CompaniesLayout() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: c.background },
        animation: 'slide_from_right',
      }}
    />
  );
}
