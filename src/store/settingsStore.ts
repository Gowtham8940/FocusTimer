import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

import {UserSettings} from '../types/models';
import {mmkvStorage} from './storage';

const defaultSettings: UserSettings = {
  backgroundColor: '#000000',
  timerTextColor: '#ffffff',
  isMuted: false,
  torchEnabled: false,
  dndEnabled: false,
  animationEnabled: true,
  timerTemplate: 'ring',
};

interface SettingsState {
  settings: UserSettings;
  updateSettings: (next: Partial<UserSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      settings: defaultSettings,
      updateSettings: next =>
        set(state => ({
          settings: {
            ...state.settings,
            ...next,
          },
        })),
    }),
    {
      name: 'focus-timer-settings-v1',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
