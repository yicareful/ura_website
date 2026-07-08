// Simulated finisher certificate data.
// No results/timing system exists yet, so finish times are deterministically
// derived from the registration id + group distance. The same registration
// always renders the same certificate.

function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
}

function pad(n: number, len = 2): string {
  return String(n).padStart(len, "0");
}

/** seconds -> "H:mm:ss" (or "m:ss" when under an hour) */
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${m}:${pad(s)}`;
}

/** seconds-of-day -> "HH:mm:ss" 24h clock */
export function formatClock(totalSeconds: number): string {
  const sec = ((totalSeconds % 86400) + 86400) % 86400;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** seconds per km -> `M'SS"/km` */
export function formatPace(secondsPerKm: number): string {
  const m = Math.floor(secondsPerKm / 60);
  const s = Math.round(secondsPerKm % 60);
  return `${m}'${pad(s)}"/km`;
}

/** Parse "HH:mm" -> seconds-of-day */
function parseClock(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return (h || 0) * 3600 + (m || 0) * 60;
}

export type FinishData = {
  startClock: string;
  finishClock: string;
  duration: string;
  pace: string;
  finishSeconds: number;
};

/**
 * Pick a realistic pace (sec/km) for the distance and derive finish times.
 * Shorter races favor faster paces; longer races favor endurance paces.
 */
export function simulateFinish(
  seed: string,
  distance: number,
  startTime: string
): FinishData {
  const hash = hashStr(seed);

  let paceMin: number;
  let paceMax: number;
  if (distance >= 20) {
    paceMin = 320; // 5:20
    paceMax = 440; // 7:20
  } else if (distance >= 9) {
    paceMin = 300; // 5:00
    paceMax = 400; // 6:40
  } else {
    paceMin = 260; // 4:20
    paceMax = 380; // 6:20
  }

  const span = paceMax - paceMin;
  const paceSeconds = paceMin + (hash % span) + ((hash % 1000) / 1000);

  const startSec = parseClock(startTime);
  const durationSeconds = Math.round(paceSeconds * distance);
  const finishSecOfDay = startSec + durationSeconds;

  return {
    startClock: formatClock(startSec),
    finishClock: formatClock(finishSecOfDay),
    duration: formatDuration(durationSeconds),
    pace: formatPace(paceSeconds),
    finishSeconds: durationSeconds,
  };
}