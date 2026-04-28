import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

import { TimerScreen } from '../screens/TimerScreen';
import { NotesScreen } from '../screens/NotesScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { theme } from '../theme/theme';
import { RootTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();

// ─── Tab icon map ──────────────────────────────────────────────────────────────
const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Timer: { active: 'timer', inactive: 'timer-outline' },
  Notes: { active: 'document-text', inactive: 'document-text-outline' },
  Reports: { active: 'bar-chart', inactive: 'bar-chart-outline' },
};

// ─── Animated Tab Button ──────────────────────────────────────────────────────
function AnimatedTabButton({
  label,
  isFocused,
  onPress,
}: {
  label: string;
  isFocused: boolean;
  onPress?: () => void;
}) {
  const progress = useSharedValue(isFocused ? 1 : 0);
  const iconBounce = useSharedValue(0);
  const glowPulse = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      progress.value = withSpring(1, { damping: 14, stiffness: 160 });
      iconBounce.value = withSequence(
        withTiming(-6, { duration: 120, easing: Easing.out(Easing.quad) }),
        withSpring(0, { damping: 8, stiffness: 220 }),
      );
      glowPulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.5, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    } else {
      progress.value = withTiming(0, { duration: 220 });
      glowPulse.value = withTiming(0, { duration: 200 });
      iconBounce.value = 0;
    }
  }, [isFocused]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.4, 1]) }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0, 0.55]),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: iconBounce.value },
      { scale: interpolate(progress.value, [0, 1], [0.92, 1]) },
    ],
  }));

  const iconColorStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['#4a6080', '#d6eaff']) as string,
  }));

  const dotStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6, 1], [0, 0, 1]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0, 1]) }],
  }));

  const icons = TAB_ICONS[label] ?? { active: 'ellipse', inactive: 'ellipse-outline' };
  const iconName = isFocused ? icons.active : icons.inactive;

  return (
    <Pressable
      style={styles.tabButtonWrapper}
      onPress={onPress}
      android_ripple={{ color: 'transparent' }}>
      <Animated.View style={[styles.tabGlow, glowStyle]} />
      <Animated.View style={[styles.tabPill, pillStyle]} />
      <Animated.View style={[styles.tabContent, containerStyle]}>
        <Animated.Text style={iconColorStyle}>
          <Icon name={iconName} size={22} />
        </Animated.Text>
        <Animated.Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
          {label}
        </Animated.Text>
      </Animated.View>
      <Animated.View style={[styles.dot, dotStyle]} />
    </Pressable>
  );
}

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBarContainer}>
      <Animated.View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <AnimatedTabButton
              key={route.key}
              label={label}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </Animated.View>
    </View>
  );
}

// ─── Home Tabs ────────────────────────────────────────────────────────────────
export function HomeTabs() {
  return (
    <Tab.Navigator
      tabBar={CustomTabBar}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Timer" component={TimerScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
    </Tab.Navigator>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 26,
    paddingHorizontal: 6,
    paddingVertical: 8,
    height: 74,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 18,
  },
  tabButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabGlow: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    borderRadius: 20,
    backgroundColor: '#1a4a80',
    shadowColor: '#2e7fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  tabPill: {
    position: 'absolute',
    width: '88%',
    height: '88%',
    borderRadius: 18,
    backgroundColor: 'rgba(46, 100, 180, 0.28)',
    borderWidth: 1,
    borderColor: 'rgba(100, 160, 255, 0.18)',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: '#4a6080',
  },
  tabLabelFocused: {
    color: '#b8d4f8',
  },
  dot: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4fa3ff',
  },
});
