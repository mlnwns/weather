import type { ForecastCategory, VillageForecastItem } from '../model/weather.types';
import {
  pickClosestForecastValue,
  type ForecastValueAtTime,
  toForecastValueAtTime,
} from './toForecastValueAtTime';
import { getSeoulYmdFromEpochMs } from './seoulDateTime';

type TodayTempRange = {
  min: ForecastValueAtTime | null;
  max: ForecastValueAtTime | null;
};

export function deriveTemperatureSummary(
  items: VillageForecastItem[],
  nowMs: number,
  rangeItems: VillageForecastItem[] = items,
): {
  currentTemp: ForecastValueAtTime | null;
  todayRange: TodayTempRange;
} {
  const todayDateYmd = getSeoulYmdFromEpochMs(nowMs);

  return {
    currentTemp: pickClosestForecastValue(items, 'TMP', nowMs),
    todayRange: pickTodayTempRange(rangeItems, todayDateYmd),
  };
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
