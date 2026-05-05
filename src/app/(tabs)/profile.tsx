import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useAuthStore } from '@/infrastructure/store/auth-store';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const initials = user?.name
    ?.split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase() ?? 'AD';

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const infoRows = [
    { label: 'Nombre', value: user?.name ?? '—', icon: 'account-outline' },
    { label: 'Email', value: user?.email ?? '—', icon: 'email-outline' },
    { label: 'Rol', value: user?.role ?? 'Administrador', icon: 'shield-account-outline' },
    {
      label: 'Empresas asignadas',
      value: String(user?.companies?.length ?? 0),
      icon: 'domain',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <View style={[styles.profileHeader, { backgroundColor: c.primary }]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.profileName}>{user?.name ?? 'Administrador'}</Text>
          <View style={styles.roleBadge}>
            <MaterialCommunityIcons name="shield-check" size={12} color="rgba(255,255,255,0.9)" />
            <Text style={styles.roleText}>  ADMIN · GESTIÓN GROBER</Text>
          </View>
        </View>

        {/* ── Info Section ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>INFORMACIÓN DE CUENTA</Text>
          <Surface style={[styles.infoCard, { backgroundColor: c.surface }]}>
            {infoRows.map((row, i) => (
              <React.Fragment key={row.label}>
                <View style={styles.infoRow}>
                  <View style={[styles.infoIcon, { backgroundColor: c.primary + '12' }]}>
                    <MaterialCommunityIcons name={row.icon as any} size={16} color={c.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: c.textMuted }]}>{row.label}</Text>
                    <Text style={[styles.infoValue, { color: c.text }]}>{row.value}</Text>
                  </View>
                </View>
                {i < infoRows.length - 1 && <Divider style={{ backgroundColor: c.divider }} />}
              </React.Fragment>
            ))}
          </Surface>
        </View>

        {/* ── Companies Section ── */}
        {user?.companies && user.companies.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>EMPRESAS ASIGNADAS</Text>
            {user.companies.map((co: any) => (
              <Surface key={co.id} style={[styles.companyRow, { backgroundColor: c.surface }]}>
                <View style={[styles.companyDot, { backgroundColor: c.primary }]} />
                <Text style={[styles.companyName, { color: c.text }]}>{co.name}</Text>
              </Surface>
            ))}
          </View>
        )}

        {/* ── App Info ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>SISTEMA</Text>
          <Surface style={[styles.infoCard, { backgroundColor: c.surface }]}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: c.primary + '12' }]}>
                <MaterialCommunityIcons name="information-outline" size={16} color={c.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: c.textMuted }]}>Versión</Text>
                <Text style={[styles.infoValue, { color: c.text }]}>1.0.0 · Mobile Ops</Text>
              </View>
            </View>
            <Divider style={{ backgroundColor: c.divider }} />
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: c.primary + '12' }]}>
                <MaterialCommunityIcons name="api" size={16} color={c.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: c.textMuted }]}>Plataforma</Text>
                <Text style={[styles.infoValue, { color: c.text }]}>SAP Fiori Horizon · Edge</Text>
              </View>
            </View>
          </Surface>
        </View>

        {/* ── Logout ── */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.85}
            style={[styles.logoutBtn, { borderColor: c.error + '60', backgroundColor: c.errorLight }]}
          >
            <MaterialCommunityIcons name="logout" size={18} color={c.error} />
            <Text style={[styles.logoutText, { color: c.error }]}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  avatarText: {
    color: '#ffffff',
    fontSize: FontSize.display,
    fontWeight: '700',
  },
  profileName: {
    color: '#ffffff',
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  roleText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  infoCard: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: FontSize.xs,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  companyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  companyName: {
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: FontSize.base,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
