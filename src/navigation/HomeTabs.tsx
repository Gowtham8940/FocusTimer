import React from 'react';
import { Platform } from 'react-native';
import { AndroidTabs } from './AndroidTabs';
import { IOSTabs } from './IOSTabs';

export function HomeTabs() {
  return Platform.OS === 'ios' ? <IOSTabs /> : <AndroidTabs />;
}