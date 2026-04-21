import {create} from 'zustand';

import {authService} from '../services/firebase/authService';

interface AuthState {
  userId: string | null;
  isAuthenticated: boolean;
  isBootstrapped: boolean;
  bootstrapAuth: () => () => void;
  signInForCloud: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  userId: null,
  isAuthenticated: false,
  isBootstrapped: false,
  bootstrapAuth: () => {
    const unsubscribe = authService.subscribe(user => {
      set({
        userId: user?.uid ?? null,
        isAuthenticated: Boolean(user),
        isBootstrapped: true,
      });
    });

    return unsubscribe;
  },
  signInForCloud: async () => {
    await authService.signInAnonymously();
    const state = get();
    if (!state.isBootstrapped) {
      set({isBootstrapped: true});
    }
  },
  signOut: async () => {
    await authService.signOut();
  },
}));
