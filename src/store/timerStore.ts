import {create} from 'zustand';

import {TimerConfig} from '../types/models';

interface TimerState {
  isRunning: boolean;
  hasStarted: boolean;
  initialSeconds: number;
  remainingSeconds: number;
  selectedConfig: TimerConfig | null;
  start: (seconds: number, config: TimerConfig) => void;
  resume: () => void;
  pause: () => void;
  tick: () => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>(set => ({
  isRunning: false,
  hasStarted: false,
  initialSeconds: 0,
  remainingSeconds: 0,
  selectedConfig: null,
  start: (seconds, config) =>
    set({
      isRunning: true,
      hasStarted: true,
      initialSeconds: seconds,
      remainingSeconds: seconds,
      selectedConfig: config,
    }),
  resume: () =>
    set(state => ({
      ...state,
      isRunning: state.remainingSeconds > 0,
    })),
  pause: () => set({isRunning: false}),
  tick: () =>
    set(state => {
      if (!state.isRunning) {
        return state;
      }

      const nextValue = Math.max(0, state.remainingSeconds - 1);

      return {
        ...state,
        remainingSeconds: nextValue,
        isRunning: nextValue > 0,
      };
    }),
  reset: () =>
    set({
      isRunning: false,
      hasStarted: false,
      initialSeconds: 0,
      remainingSeconds: 0,
      selectedConfig: null,
    }),
}));
