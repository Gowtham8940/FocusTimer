import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { formatDuration } from '../../../utils/time';

export function BoldTimer({ remainingSeconds, color }: { remainingSeconds: number, color: string }) {
  const timeStr = formatDuration(remainingSeconds);
  
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color }]}>{timeStr}</Text>
      <Text style={styles.focusText}>FOCUS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontSize: 88,
    fontWeight: '900',
    fontFamily: 'Impact', // Fallback to system bold
    fontVariant: ['tabular-nums'],
  },
  focusText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 8,
    color: 'rgba(255,255,255,0.2)',
    marginTop: -10,
  },
});
