import React from 'react';
import { StatusBar, StyleSheet, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuthBootstrap } from './src/hooks/useAuthBootstrap';
import { RootNavigator } from './src/navigation/RootNavigator';
import { theme } from './src/theme/theme';

LogBox.ignoreAllLogs();

function AppContent() {
  useAuthBootstrap();

  return <RootNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
