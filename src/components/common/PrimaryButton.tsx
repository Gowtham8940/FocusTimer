import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

import {theme} from '../../theme/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
}

export function PrimaryButton({label, onPress}: PrimaryButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 120,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  text: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
