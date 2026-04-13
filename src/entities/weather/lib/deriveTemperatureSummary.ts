import type { ForecastCategory, VillageForecastItem } from '../model/weather.types';
import {
  pickClosestForecastValue,
  type ForecastValueAtTime,
  toForecastValueAtTime,
} from './toForecastValueAtTime';

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
  const todayDateYmd = getSeoulYmd(nowMs);

  return {
    currentTemp: pickClosestForecastValue(items, 'TMP', nowMs),
    todayRange: pickTodayTempRange(items, todayDateYmd),
  };
}

function getSeoulYmd(epochMs: number): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(new Date(epochMs));
  const getPartValue = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  return `${getPartValue('year')}${getPartValue('month')}${getPartValue('day')}`;
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
  forecastDateYmd: string,
): ForecastValueAtTime[] {
  return items
    .filter((item) => item.category === category && item.fcstDate === forecastDateYmd)
    .map((item) => toForecastValueAtTime(item))
    .filter((v): v is ForecastValueAtTime => v !== null);
}

function pickTodayTempRange(items: VillageForecastItem[], todayYmd: string): TodayTempRange {
  const minTempFromTmn = pickEarliestByFcstTime(
    collectForecastValuesForDate(items, 'TMN', todayYmd),
  );
  const maxTempFromTmx = pickEarliestByFcstTime(
    collectForecastValuesForDate(items, 'TMX', todayYmd),
  );

  if (minTempFromTmn || maxTempFromTmx) {
    return { min: minTempFromTmn ?? null, max: maxTempFromTmx ?? null };
  }

  const tempForecastsToday = collectForecastValuesForDate(items, 'TMP', todayYmd);
  if (tempForecastsToday.length === 0) return { min: null, max: null };

  const minTempFromTmp = tempForecastsToday.reduce((acc, cur) =>
    cur.value < acc.value ? cur : acc,
  );
  const maxTempFromTmp = tempForecastsToday.reduce((acc, cur) =>
    cur.value > acc.value ? cur : acc,
  );

  return { min: minTempFromTmp, max: maxTempFromTmp };
}
