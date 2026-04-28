import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

import { CategoryManagerScreen } from '../screens/CategoryManagerScreen';
import { NotesScreen } from '../screens/NotesScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { theme } from '../theme/theme';
import { RootDrawerParamList } from '../types/navigation';
import { CustomDrawerContent } from './Customdrawer';
import { CustomAppHeader } from '../components/common/CustomAppHeader';
import { HomeTabs } from './HomeTabs';
import { TimerTemplatesScreen } from '../screens/TimerTemplatesScreen';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

// ─── Nav theme ────────────────────────────────────────────────────────────────
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: theme.colors.border,
    primary: theme.colors.accent,
  },
};

// ─── Root Navigator ───────────────────────────────────────────────────────────
export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Drawer.Navigator
        initialRouteName="HomeTabs"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          headerStyle: styles.navHeader,
          headerTintColor: theme.colors.text,
          sceneContainerStyle: styles.sceneContainer,
          drawerStyle: styles.drawer,
          drawerActiveBackgroundColor: theme.colors.background,
          drawerActiveTintColor: theme.colors.text,
          drawerInactiveTintColor: theme.colors.mutedText,
          headerTitle: '',
          headerLeft: () => (
            <AnimatedMenuButton onPress={() => navigation.toggleDrawer()} />
          ),
        })}>
        <Drawer.Screen 
          name="HomeTabs" 
          component={HomeTabs} 
          options={{ 
            title: 'Focus Timer',
            header: (props) => <CustomAppHeader {...props} />
          }} 
        />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="CategoryManager" component={CategoryManagerScreen} />
        <Drawer.Screen 
          name="TimerTemplates" 
          component={TimerTemplatesScreen} 
          options={({ navigation }) => ({ 
            title: 'Timer Templates',
            headerRight: () => (
              <Pressable 
                onPress={() => navigation.navigate('HomeTabs')} 
                style={styles.applyButton}
              >
                <Text style={styles.applyText}>APPLY</Text>
              </Pressable>
            )
          })} 
        />
        <Drawer.Screen name="Notes" component={NotesScreen} />
        <Drawer.Screen name="Reports" component={ReportsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// ─── Animated hamburger button ────────────────────────────────────────────────
function AnimatedMenuButton({ onPress }: { onPress: () => void }) {
  const pressed = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 0.88]) }],
    opacity: interpolate(pressed.value, [0, 1], [1, 0.7]),
  }));

  return (
    <Pressable
      onPressIn={() => { pressed.value = withTiming(1, { duration: 80 }); }}
      onPressOut={() => { pressed.value = withSpring(0); }}
      onPress={onPress}
      style={styles.menuButton}
      hitSlop={15}
    >
      <Animated.View style={animStyle}>
        <Icon name="menu-outline" size={26} color={theme.colors.text} />
      </Animated.View>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  navHeader: {
    backgroundColor: theme.colors.surface,
  },
  sceneContainer: {
    backgroundColor: theme.colors.background,
  },
  drawer: {
    backgroundColor: theme.colors.surface,
    width: 280,
  },
  menuButton: {
    padding: 12,
    marginLeft: 4,
  },
  applyButton: {
    marginRight: 16,
    backgroundColor: 'rgba(79, 163, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 163, 255, 0.3)',
  },
  applyText: {
    color: theme.colors.accent,
    fontWeight: '700',
    fontSize: 13,
  },
});