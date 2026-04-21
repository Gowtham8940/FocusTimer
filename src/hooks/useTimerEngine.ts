import {useEffect} from 'react';

import {useTimerStore} from '../store/timerStore';

export function useTimerEngine() {
  const isRunning = useTimerStore(state => state.isRunning);
  const tick = useTimerStore(state => state.tick);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, tick]);
}
