import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text, HelperText, Divider } from 'react-native-paper';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('grober@admin.com');
  const [password, setPassword] = useState('password');
  const { mutate: login, isPending, error } = useLogin();

  const handleLogin = () => {
    login({ email, password });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons name="shield-check-outline" size={32} color="#0070f2" />
            </View>
            <Text variant="headlineMedium" style={styles.brandName}>Gestión Grober</Text>
            <Text variant="titleSmall" style={styles.brandSubtitle}>MOBILE OPERATIONS · PLANT EDGE</Text>
            <View style={styles.underline} />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={styles.inputLabel}>USUARIO / EMAIL</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                placeholder="usuario@grober.com"
                autoCapitalize="none"
                keyboardType="email-address"
                outlineColor="#d9d9d9"
                activeOutlineColor="#0070f2"
                placeholderTextColor="#a0a0a0"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={styles.inputLabel}>CONTRASEÑA</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                outlineColor="#d9d9d9"
                activeOutlineColor="#0070f2"
              />
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle" size={18} color="#bb0000" />
                <Text style={styles.errorText}>
                  No se pudo iniciar sesión. Verifique sus datos.
                </Text>
              </View>
            )}

            <Button 
              mode="contained" 
              onPress={handleLogin} 
              loading={isPending}
              disabled={isPending || !email || !password}
              style={styles.loginButton}
              contentStyle={styles.loginButtonContent}
              labelStyle={styles.loginButtonLabel}
            >
              LOG ON
            </Button>
            
            <Button 
              mode="text" 
              onPress={() => {}} 
              style={styles.secondaryButton}
              labelStyle={{ color: '#0070f2', fontSize: 13, fontWeight: '600' }}
            >
              ¿Olvidó su contraseña?
            </Button>
          </View>

          <View style={styles.footer}>
            <Divider style={styles.footerDivider} />
            <Text variant="bodySmall" style={styles.footerText}>
              SAP Fiori Horizon · Enterprise Edition
            </Text>
            <Text variant="labelSmall" style={styles.versionText}>
              v1.0.0-stable
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandName: {
    fontWeight: '300',
    color: '#1d2d3e',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  brandSubtitle: {
    color: '#6a6d70',
    marginTop: 8,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  underline: {
    width: 40,
    height: 3,
    backgroundColor: '#0070f2',
    marginTop: 16,
    borderRadius: 2,
  },
  formContainer: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#555',
    marginBottom: 8,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#fafafa',
    height: 44,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#bb0000',
  },
  errorText: {
    marginLeft: 8,
    color: '#bb0000',
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 4,
    backgroundColor: '#0070f2',
  },
  loginButtonContent: {
    height: 48,
  },
  loginButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  secondaryButton: {
    marginTop: 16,
  },
  footer: {
    marginTop: 64,
    alignItems: 'center',
  },
  footerDivider: {
    width: 60,
    marginBottom: 16,
    backgroundColor: '#e5e5e5',
  },
  footerText: {
    color: '#6a6d70',
    fontWeight: '500',
  },
  versionText: {
    color: '#a0a0a0',
    marginTop: 4,
  },
});
