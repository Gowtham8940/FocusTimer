import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue
} from 'react-native-reanimated';
import { formatDuration } from '../../../utils/time';
import { theme } from '../../../theme/theme';

export function NeonTimer({ remainingSeconds, color }: { remainingSeconds: number, color: string }) {
  const glow = useSharedValue(0.4);

  React.useEffect(() => {
    glow.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    textShadowRadius: 15 * glow.value,
    textShadowColor: color,
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { color }, animatedStyle]}>
        {formatDuration(remainingSeconds)}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 72,
    fontWeight: '900',
    fontFamily: 'Courier',
    letterSpacing: 4,
  },
});
