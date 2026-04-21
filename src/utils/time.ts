export function formatDuration(totalSeconds: number) {
  const safe = Math.max(totalSeconds, 0);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  return [hours, minutes, seconds]
    .map(part => part.toString().padStart(2, '0'))
    .join(':');
}

export function dateKeyFromEpoch(epoch: number) {
  return new Date(epoch).toISOString().slice(0, 10);
}
