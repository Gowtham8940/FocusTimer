import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { formatDuration } from '../../../utils/time';

export function DotTimer({ remainingSeconds, totalSeconds, color }: { remainingSeconds: number, totalSeconds: number, color: string }) {
  const scale = useSharedValue(1);
  const pulse = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 1.5 : 1, { duration: 1000 });
  }, [remainingSeconds, totalSeconds]);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pulse.value }],
    backgroundColor: color,
    opacity: 0.15 + (scale.value * 0.5),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, dotStyle]} />
      <Text style={[styles.text, { color }]}>{formatDuration(remainingSeconds)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
  },
  dot: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  text: {
    fontSize: 54,
    fontWeight: '300',
    fontFamily: 'Courier',
    zIndex: 1,
  },
});
