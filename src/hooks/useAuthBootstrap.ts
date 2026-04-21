import {useEffect} from 'react';

import {useAuthStore} from '../store/authStore';

export function useAuthBootstrap() {
  const bootstrapAuth = useAuthStore(state => state.bootstrapAuth);

  useEffect(() => {
    const unsubscribe = bootstrapAuth();
    return unsubscribe;
  }, [bootstrapAuth]);
}
