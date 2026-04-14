import type { ForecastCategory, VillageForecastItem } from '../model/weather.types';
import { to2DigitString, toSeoulDateTimeParts, toYmd } from './seoulDateTime';
import { mapPtyToLabel, mapSkyToLabel } from './conditionLabels';

export type HourlyForecastSlot = {
  epochMs: number;
  hourLabel: string;
  conditionLabel: string | null;
  temperature: number | null;
  isCurrentHour: boolean;
};

const HOUR_MS = 60 * 60 * 1000;

export function deriveHourlyForecastSlots(
  items: VillageForecastItem[],
  nowMs: number,
): HourlyForecastSlot[] {
  const startEpochMs = floorToKstHourEpochMs(nowMs);

  const nowParts = toSeoulDateTimeParts(new Date(nowMs));
  const todayMidnightEpochMs = new Date(
    `${nowParts.year}-${to2DigitString(nowParts.month)}-${to2DigitString(nowParts.day)}T00:00:00+09:00`,
  ).getTime();

  const tomorrowMidnightEpochMs = todayMidnightEpochMs + 24 * HOUR_MS;
  const tomorrowParts = toSeoulDateTimeParts(new Date(tomorrowMidnightEpochMs));
  const tomorrowYmd = toYmd({
    year: tomorrowParts.year,
    month: tomorrowParts.month,
    day: tomorrowParts.day,
  });

  const endEpochMs = tomorrowMidnightEpochMs + 23 * HOUR_MS;

  if (startEpochMs > endEpochMs) return [];

  const lookup = buildValueLookup(items, ['TMP', 'PTY', 'SKY']);

  const slots: HourlyForecastSlot[] = [];
  for (let epochMs = startEpochMs; epochMs <= endEpochMs; epochMs += HOUR_MS) {
    const { fcstDate, fcstTime, hour, slotYmd } = toForecastDateTime(epochMs);

    const temperature = getValue(lookup, 'TMP', fcstDate, fcstTime);

    const ptyValue = getValue(lookup, 'PTY', fcstDate, fcstTime);
    const skyValue = getValue(lookup, 'SKY', fcstDate, fcstTime);

    const conditionLabel =
      ptyValue !== null && ptyValue !== 0
        ? mapPtyToLabel(ptyValue)
        : skyValue !== null
          ? mapSkyToLabel(skyValue)
          : null;

    const hourLabel = slotYmd === tomorrowYmd ? formatTomorrowHourLabel(hour) : `${hour}시`;

    slots.push({
      epochMs,
      hourLabel,
      conditionLabel,
      temperature,
      isCurrentHour: epochMs === startEpochMs,
    });
  }

  return slots;
}

function floorToKstHourEpochMs(epochMs: number): number {
  const parts = toSeoulDateTimeParts(new Date(epochMs));

  const yyyy = parts.year;
  const mm = to2DigitString(parts.month);
  const dd = to2DigitString(parts.day);
  const hh = to2DigitString(parts.hour);

  return new Date(`${yyyy}-${mm}-${dd}T${hh}:00:00+09:00`).getTime();
}

type ForecastDateTime = {
  fcstDate: string;
  fcstTime: string;
  hour: number;
  slotYmd: string;
};

function toForecastDateTime(epochMs: number): ForecastDateTime {
  const parts = toSeoulDateTimeParts(new Date(epochMs));
  const slotYmd = toYmd({ year: parts.year, month: parts.month, day: parts.day });

  return {
    fcstDate: slotYmd,
    fcstTime: `${to2DigitString(parts.hour)}00`,
    hour: parts.hour,
    slotYmd,
  };
}

function formatTomorrowHourLabel(hour: number): string {
  if (hour === 0) return '내일';
  return `${to2DigitString(hour)}시`;
}

type ValueLookup = Map<string, number>;

function buildValueLookup(
  items: VillageForecastItem[],
  categories: ForecastCategory[],
): ValueLookup {
  const categorySet = new Set(categories);
  const lookup: ValueLookup = new Map();

  for (const item of items) {
    if (!categorySet.has(item.category)) continue;

    const value = Number(item.fcstValue);
    if (!Number.isFinite(value)) continue;

    lookup.set(makeKey(item.category, item.fcstDate, item.fcstTime), value);
  }

  return lookup;
}

function getValue(
  lookup: ValueLookup,
  category: ForecastCategory,
  fcstDate: string,
  fcstTime: string,
): number | null {
  const value = lookup.get(makeKey(category, fcstDate, fcstTime));
  return value === undefined ? null : value;
}

function makeKey(category: ForecastCategory, fcstDate: string, fcstTime: string): string {
  return `${category}|${fcstDate}|${fcstTime}`;
}
