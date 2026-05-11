import React from 'react';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';

import { TimerScreen } from '../screens/TimerScreen';
import { NotesScreen } from '../screens/NotesScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { RootTabParamList } from '../types/navigation';

/**
 * iOS Implementation Steps for Native Bottom Tabs:
 * 
 * 1. Install necessary dependencies:
 *    Run: npm install @bottom-tabs/react-navigation react-native-screens react-native-safe-area-context
 * 
 * 2. Update iOS native project:
 *    Run: npx pod-install ios (This links the native UITabBarController components)
 * 
 * 3. Import createNativeBottomTabNavigator:
 *    This navigator uses native iOS controllers instead of JavaScript-based ones.
 * 
 * 4. Define the Tab Navigator:
 *    Use the RootTabParamList to ensure type safety for your screens and params.
 * 
 * 5. Configure Screen Options:
 *    Set tabBarActiveTintColor for consistent branding. (Inactive color is system-managed)
 * 
 * 6. Use SF Symbols for Icons:
 *    On iOS, use the sfSymbol property in tabBarIcon options. 
 *    These are system-native icons and do not require external icon libraries.
 * 
 * 7. Build Requirements:
 *    Ensure you are using Xcode 26 or higher and building for iOS 18+ to support 
 *    the latest system features like Liquid Glass.
 * 
 * 8. Performance Note:
 *    Since this uses native controllers, it offers better performance and 
 *    smoother transitions than JS-based tab bars.
 */

const NativeTab = createNativeBottomTabNavigator<RootTabParamList>();

const TAB_SF_SYMBOLS = {
  Timer:   'timer',
  Notes:   'doc.text',
  Reports: 'chart.bar',
} as const;

export function IOSTabs() {
  return (
    <NativeTab.Navigator
      screenOptions={{
        tabBarActiveTintColor:   '#4fa3ff',
      }}>
      <NativeTab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          title: 'Timer',
          tabBarIcon: () => ({ sfSymbol: TAB_SF_SYMBOLS.Timer }),
        }}
      />
      <NativeTab.Screen
        name="Notes"
        component={NotesScreen}
        options={{
          title: 'Notes',
          tabBarIcon: () => ({ sfSymbol: TAB_SF_SYMBOLS.Notes }),
        }}
      />
      <NativeTab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: 'Reports',
          tabBarIcon: () => ({ sfSymbol: TAB_SF_SYMBOLS.Reports }),
        }}
      />
    </NativeTab.Navigator>
  );
}
