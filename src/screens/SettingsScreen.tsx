import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';

import {ScreenShell} from '../components/common/ScreenShell';
import {useSettingsStore} from '../store/settingsStore';
import {theme} from '../theme/theme';

export function SettingsScreen() {
  const settings = useSettingsStore(state => state.settings);
  const updateSettings = useSettingsStore(state => state.updateSettings);

  return (
    <ScreenShell>
      <View style={styles.row}>
        <Text style={styles.text}>Mute</Text>
        <Switch
          value={settings.isMuted}
          onValueChange={value => updateSettings({isMuted: value})}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Torch</Text>
        <Switch
          value={settings.torchEnabled}
          onValueChange={value => updateSettings({torchEnabled: value})}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>DND</Text>
        <Switch
          value={settings.dndEnabled}
          onValueChange={value => updateSettings({dndEnabled: value})}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 16,
  },
  text: {
    color: theme.colors.text,
    fontSize: 16,
  },
});
