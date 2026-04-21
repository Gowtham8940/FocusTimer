import React, {PropsWithChildren} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

import {theme} from '../../theme/theme';

export function ScreenShell({children}: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
});
