import type { ForecastCategory, VillageForecastItem } from '../model/weather.types';

export type ForecastValueAtTime = {
  value: number;
  fcstDate: string;
  fcstTime: string;
};

export function toForecastValueAtTime(item: VillageForecastItem): ForecastValueAtTime | null {
  const value = parseNumber(item.fcstValue);
  if (value === null) return null;

  return { value, fcstDate: item.fcstDate, fcstTime: item.fcstTime };
}

export function pickClosestForecastValue(
  items: VillageForecastItem[],
  category: ForecastCategory,
  nowEpochMs: number,
): ForecastValueAtTime | null {
  let best: ForecastValueAtTime | null = null;
  let bestDelta = Number.POSITIVE_INFINITY;

  for (const item of items) {
    if (item.category !== category) continue;

    const value = parseNumber(item.fcstValue);
    if (value === null) continue;

    const slotEpochMs = toKstEpochMs(item.fcstDate, item.fcstTime);
    const delta = Math.abs(slotEpochMs - nowEpochMs);

    if (delta < bestDelta) {
      bestDelta = delta;
      best = { value, fcstDate: item.fcstDate, fcstTime: item.fcstTime };
    }
  }

  return best;
}

function parseNumber(value: string): number | null {
  const parsedNumber = Number(value);
  return Number.isFinite(parsedNumber) ? parsedNumber : null;
}

function toKstEpochMs(fcstDate: string, fcstTime: string): number {
  const year = fcstDate.slice(0, 4);
  const month = fcstDate.slice(4, 6);
  const day = fcstDate.slice(6, 8);

  const hour = fcstTime.slice(0, 2);
  const minute = fcstTime.slice(2, 4);

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:00+09:00`).getTime();
}
