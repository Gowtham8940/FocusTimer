import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {useAuthBootstrap} from './src/hooks/useAuthBootstrap';
import {RootNavigator} from './src/navigation/RootNavigator';
import {theme} from './src/theme/theme';

function AppContent() {
  useAuthBootstrap();

  return <RootNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <AppContent />
    </SafeAreaProvider>
  );
}
