import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { formatDuration } from '../../../utils/time';
import { theme } from '../../../theme/theme';

interface MinimalTimerProps {
  remainingSeconds: number;
  color: string;
}

export function MinimalTimer({ remainingSeconds, color }: MinimalTimerProps) {
  const parts = formatDuration(remainingSeconds).split(':');

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={[styles.timePart, { color }]}>{parts[0]}</Text>
      </View>
      <Text style={[styles.colon, { color: theme.colors.mutedText }]}>:</Text>
      <View style={styles.card}>
        <Text style={[styles.timePart, { color }]}>{parts[1]}</Text>
      </View>
      <Text style={[styles.colon, { color: theme.colors.mutedText }]}>:</Text>
      <View style={styles.card}>
        <Text style={[styles.timePart, { color }]}>{parts[2]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 90,
    alignItems: 'center',
  },
  timePart: {
    fontSize: 56,
    fontWeight: '400',
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  colon: {
    fontSize: 48,
    fontWeight: '300',
    marginHorizontal: 8,
    opacity: 0.5,
    paddingBottom: 8,
  },
});
