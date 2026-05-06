import React from 'react';
import { Appbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: {
    icon: string;
    onPress: () => void;
    color?: string;
    badge?: string | number | boolean;
  }[];
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  elevated?: boolean;
  mode?: 'small' | 'medium' | 'large' | 'center-aligned';
  dark?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack,
  onBack,
  actions,
  style,
  titleStyle,
  subtitleStyle,
  elevated = true,
  mode = 'small',
  dark = false,
}) => {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const contentColor = dark ? '#ffffff' : c.text;
  const mutedColor = dark ? 'rgba(255,255,255,0.7)' : c.textMuted;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <Appbar.Header
      mode={mode}
      elevated={elevated}
      style={[
        { backgroundColor: dark ? c.primary : (mode === 'small' ? c.surface : c.background) },
        style
      ]}
    >
      {showBack && <Appbar.BackAction onPress={handleBack} color={contentColor} />}
      <Appbar.Content
        title={title}
        subtitle={subtitle}
        titleStyle={[
          {
            color: contentColor,
            fontSize: 18,
            fontWeight: '700',
            letterSpacing: 0.3,
          },
          titleStyle
        ]}
        subtitleStyle={[
          {
            color: mutedColor,
            fontSize: 12,
            fontWeight: '500',
          },
          subtitleStyle
        ]}
      />
      {actions?.map((action, index) => (
        <Appbar.Action
          key={index}
          icon={action.icon}
          onPress={action.onPress}
          color={action.color ?? contentColor}
        />
      ))}
    </Appbar.Header>
  );
};
