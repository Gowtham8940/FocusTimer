import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {CategoryManagerScreen} from '../screens/CategoryManagerScreen';
import {NotesScreen} from '../screens/NotesScreen';
import {ReportsScreen} from '../screens/ReportsScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import {TimerScreen} from '../screens/TimerScreen';
import {theme} from '../theme/theme';
import {RootStackParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

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

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Timer"
        screenOptions={{
          headerStyle: {backgroundColor: theme.colors.surface},
          headerTintColor: theme.colors.text,
          contentStyle: {backgroundColor: theme.colors.background},
        }}>
        <Stack.Screen
          name="Timer"
          component={TimerScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="CategoryManager" component={CategoryManagerScreen} />
        <Stack.Screen name="Notes" component={NotesScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
