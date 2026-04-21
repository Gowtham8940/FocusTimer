import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {formatDuration} from '../../utils/time';

interface TimerDisplayProps {
  seconds: number;
  color: string;
}

export const TimerDisplay = memo(function TimerDisplay({
  seconds,
  color,
}: TimerDisplayProps) {
  return (
    <View>
      <Text style={[styles.timerText, {color}]}>{formatDuration(seconds)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  timerText: {
    fontSize: 68,
    fontWeight: '700',
    letterSpacing: 3,
    fontFamily: 'Courier',
    fontVariant: ['tabular-nums'],
  },
});
