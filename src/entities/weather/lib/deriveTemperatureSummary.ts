import type { ForecastCategory, VillageForecastItem } from '../model/weather.types';

type ForecastValueAtTime = {
  value: number;
  fcstDate: string;
  fcstTime: string;
};

type TodayTempRange = {
  min: ForecastValueAtTime | null;
  max: ForecastValueAtTime | null;
};

export function deriveTemperatureSummary(
  items: VillageForecastItem[],
  nowMs: number,
): {
  currentTemp: ForecastValueAtTime | null;
  todayRange: TodayTempRange;
} {
  const todayYmd = getSeoulYmd(nowMs);

  return {
    currentTemp: pickClosestValue(items, 'TMP', nowMs),
    todayRange: pickTodayTempRange(items, todayYmd),
  };
}

function parseNumber(value: string): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toKstEpochMs(fcstDate: string, fcstTime: string): number {
  const yyyy = fcstDate.slice(0, 4);
  const mm = fcstDate.slice(4, 6);
  const dd = fcstDate.slice(6, 8);

  const hh = fcstTime.slice(0, 2);
  const min = fcstTime.slice(2, 4);

  return new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:00+09:00`).getTime();
}

function getSeoulYmd(ms: number): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(new Date(ms));
  const lookup = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  return `${lookup('year')}${lookup('month')}${lookup('day')}`;
}

function toForecastValueAtTime(item: VillageForecastItem): ForecastValueAtTime | null {
  const value = parseNumber(item.fcstValue);
  if (value === null) return null;

  return { value, fcstDate: item.fcstDate, fcstTime: item.fcstTime };
}

function pickEarliestByFcstTime(values: ForecastValueAtTime[]): ForecastValueAtTime | null {
  if (values.length === 0) return null;
  return values
    .slice()
    .sort((a, b) => (a.fcstTime < b.fcstTime ? -1 : a.fcstTime > b.fcstTime ? 1 : 0))[0];
}

function collectForecastValuesForDate(
  items: VillageForecastItem[],
  category: ForecastCategory,
  ymd: string,
): ForecastValueAtTime[] {
  return items
    .filter((it) => it.category === category && it.fcstDate === ymd)
    .map((it) => toForecastValueAtTime(it))
    .filter((v): v is ForecastValueAtTime => v !== null);
}

function pickClosestValue(
  items: VillageForecastItem[],
  category: ForecastCategory,
  nowMs: number,
): ForecastValueAtTime | null {
  let best: ForecastValueAtTime | null = null;
  let bestDelta = Number.POSITIVE_INFINITY;

  for (const it of items) {
    if (it.category !== category) continue;
    const value = parseNumber(it.fcstValue);
    if (value === null) continue;

    const slotMs = toKstEpochMs(it.fcstDate, it.fcstTime);
    const delta = Math.abs(slotMs - nowMs);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = { value, fcstDate: it.fcstDate, fcstTime: it.fcstTime };
    }
  }

  return best;
}

function pickTodayTempRange(items: VillageForecastItem[], todayYmd: string): TodayTempRange {
  const tmn = pickEarliestByFcstTime(collectForecastValuesForDate(items, 'TMN', todayYmd));
  const tmx = pickEarliestByFcstTime(collectForecastValuesForDate(items, 'TMX', todayYmd));

  if (tmn || tmx) {
    return { min: tmn ?? null, max: tmx ?? null };
  }

  const tmpToday = collectForecastValuesForDate(items, 'TMP', todayYmd);
  if (tmpToday.length === 0) return { min: null, max: null };

  const min = tmpToday.reduce((acc, cur) => (cur.value < acc.value ? cur : acc));
  const max = tmpToday.reduce((acc, cur) => (cur.value > acc.value ? cur : acc));

  return { min, max };
}
