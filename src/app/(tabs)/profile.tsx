import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/infrastructure/store/auth-store';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppHeader } from '@/components/ui/app-header';
import { styles } from './_profile.styles';

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
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <StatusBar style="light" />
      <AppHeader
        title="Mi Perfil"
        dark
        showBack
        elevated={false}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <View style={[styles.profileHeader, { backgroundColor: c.primary }]}>
          <View style={styles.avatarCircle}>
            <Text style={[styles.avatarText, { color: '#ffffff' }]}>{initials}</Text>
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
    </View>
  );
}
