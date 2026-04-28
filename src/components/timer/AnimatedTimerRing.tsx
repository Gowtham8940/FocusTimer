import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width } = Dimensions.get('window');
const SIZE = width * 0.8;
interface AnimatedTimerRingProps {
  remainingSeconds: number;
  totalSeconds: number;
  color: string;
  size?: number;
}

export function AnimatedTimerRing({ remainingSeconds, totalSeconds, color, size = width * 0.8 }: AnimatedTimerRingProps) {
  const STROKE_WIDTH = size > 150 ? 10 : 4;
  const RADIUS = (size - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = RADIUS * 2 * Math.PI;

  const progress = useSharedValue(totalSeconds > 0 ? remainingSeconds / totalSeconds : 1);

  useEffect(() => {
    if (totalSeconds > 0) {
      progress.value = withTiming(remainingSeconds / totalSeconds, {
        duration: 1000,
        easing: Easing.linear,
      });
    } else {
      progress.value = 1;
    }
  }, [remainingSeconds, totalSeconds]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={RADIUS}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={RADIUS}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
