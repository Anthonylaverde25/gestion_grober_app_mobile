import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { BrandLogo } from '@/components/brand-logo';
import { styles } from './login.styles';

export default function LoginScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [email, setEmail] = useState('grober@admin.com');
  const [password, setPassword] = useState('password');
  const { mutate: login, isPending, error } = useLogin();

  const handleLogin = () => {
    login({ email, password });
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Brand Header */}
          <View style={[styles.brandHeader, { backgroundColor: c.primary }]}>
            <View style={styles.logoCircle}>
              <BrandLogo size={70} />
            </View>
            <Text style={styles.brandName}>SISTEMA DE GESTIÓN</Text>
            <Text style={styles.brandSubtitle}>SUPERVISIÓN DE OPERACIONES MULTIEMPRESA</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={[styles.welcomeText, { color: c.text }]}>Bienvenido de nuevo</Text>
            <Text style={styles.instructionText}>Ingrese sus credenciales para acceder al sistema</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CORREO ELECTRÓNICO</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                placeholder="usuario@grober.com"
                autoCapitalize="none"
                keyboardType="email-address"
                outlineColor={c.border}
                activeOutlineColor={c.primary}
                left={<TextInput.Icon icon="email-outline" color={c.textMuted} />}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CONTRASEÑA</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                outlineColor={c.border}
                activeOutlineColor={c.primary}
                left={<TextInput.Icon icon="lock-outline" color={c.textMuted} />}
              />
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle" size={18} color="#bb0000" />
                <Text style={styles.errorText}>
                  Error de autenticación. Verifique sus datos.
                </Text>
              </View>
            )}

            <Button 
              mode="contained" 
              onPress={handleLogin} 
              loading={isPending}
              disabled={isPending || !email || !password}
              style={[styles.loginButton, { backgroundColor: c.primary }]}
              labelStyle={styles.loginButtonLabel}
              elevation={2}
            >
              LOG ON
            </Button>
            
            <Button 
              mode="text" 
              onPress={() => {}} 
              style={{ marginTop: 12 }}
              labelStyle={{ color: c.primary, fontSize: 13, fontWeight: '700' }}
            >
              ¿OLVIDÓ SU CONTRASEÑA?
            </Button>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>SAP Fiori Horizon · Industrial Intelligence</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>v1.0.5-STABLE</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
