import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { formatDuration } from '../../../utils/time';
import { theme } from '../../../theme/theme';

const FlipCard = ({ val, color }: { val: string; color: string }) => (
  <View style={styles.card}>
    <Text style={[styles.text, { color }]}>{val}</Text>
    <View style={styles.divider} />
  </View>
);

export function FlipTimer({ remainingSeconds, color }: { remainingSeconds: number, color: string }) {
  const parts = formatDuration(remainingSeconds).split(':');

  return (
    <View style={styles.container}>
      <FlipCard val={parts[0]} color={color} />
      <Text style={styles.colon}>:</Text>
      <FlipCard val={parts[1]} color={color} />
      <Text style={styles.colon}>:</Text>
      <FlipCard val={parts[2]} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    minWidth: 80,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#333',
  },
  divider: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  text: {
    fontSize: 52,
    fontWeight: '700',
    fontFamily: 'Courier',
  },
  colon: {
    fontSize: 40,
    color: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
    fontWeight: '700',
  },
});
