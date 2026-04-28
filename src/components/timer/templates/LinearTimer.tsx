import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { formatDuration } from '../../../utils/time';
import { theme } from '../../../theme/theme';

const { width } = Dimensions.get('window');
const BAR_WIDTH = width * 0.85;

export function LinearTimer({ remainingSeconds, totalSeconds, color }: { remainingSeconds: number, totalSeconds: number, color: string }) {
  const progress = useSharedValue(totalSeconds > 0 ? remainingSeconds / totalSeconds : 1);

  useEffect(() => {
    progress.value = withTiming(totalSeconds > 0 ? remainingSeconds / totalSeconds : 0, { duration: 1000 });
  }, [remainingSeconds, totalSeconds]);

  const barStyle = useAnimatedStyle(() => ({
    width: BAR_WIDTH * progress.value,
  }));

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color }]}>{formatDuration(remainingSeconds)}</Text>
      <View style={[styles.track, { width: BAR_WIDTH }]}>
        <Animated.View style={[styles.bar, { backgroundColor: color }, barStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontSize: 60,
    fontWeight: '700',
    fontFamily: 'Courier',
    marginBottom: 30,
  },
  track: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 3,
  },
});
