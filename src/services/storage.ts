import { createMMKV } from 'react-native-mmkv';

/**
 * MMKV Storage Instance
 * We use the createMMKV factory function which is the modern v4+ API.
 */
export const storage = createMMKV({
  id: 'focus-timer-storage',
});
