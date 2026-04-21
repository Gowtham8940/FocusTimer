import {create} from 'zustand';

import {UserSettings} from '../types/models';

const defaultSettings: UserSettings = {
  backgroundColor: '#000000',
  timerTextColor: '#ffffff',
  isMuted: false,
  torchEnabled: false,
  dndEnabled: false,
  animationEnabled: true,
};

interface SettingsState {
  settings: UserSettings;
  updateSettings: (next: Partial<UserSettings>) => void;
}

export const useSettingsStore = create<SettingsState>(set => ({
  settings: defaultSettings,
  updateSettings: next =>
    set(state => ({
      settings: {
        ...state.settings,
        ...next,
      },
    })),
}));
