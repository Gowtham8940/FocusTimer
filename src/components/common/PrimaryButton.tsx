import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {theme} from '../../theme/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  iconName?: string;
  variant?: 'primary' | 'danger' | 'ghost';
}

export function PrimaryButton({label, onPress, disabled, iconName, variant = 'primary'}: PrimaryButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'danger': return styles.buttonDanger;
      case 'ghost': return styles.buttonGhost;
      default: return styles.buttonPrimary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.mutedText;
    if (variant === 'danger') return theme.colors.text;
    if (variant === 'ghost') return theme.colors.mutedText;
    return theme.colors.text;
  };

  return (
    <Pressable 
      onPress={disabled ? undefined : onPress} 
      style={[styles.button, getButtonStyle(), disabled && styles.disabledButton]}>
      <View style={styles.content}>
        {iconName && <Icon name={iconName} size={20} color={getTextColor()} style={styles.icon} />}
        <Text style={[styles.text, {color: getTextColor()}]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 120,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonDanger: {
    backgroundColor: 'rgba(242, 72, 72, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(242, 72, 72, 0.3)',
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
