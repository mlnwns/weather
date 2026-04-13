import type { VillageForecastItem } from '../model/weather.types';
import { pickClosestForecastValue } from './toForecastValueAtTime';

export type CurrentCondition = {
  label: string;
  basedOn: 'PTY' | 'SKY';
  fcstDate: string;
  fcstTime: string;
} | null;

export function deriveCurrentCondition(
  items: VillageForecastItem[],
  nowMs: number,
): CurrentCondition {
  const precipitationType = pickClosestForecastValue(items, 'PTY', nowMs);
  if (precipitationType && precipitationType.value !== 0) {
    return {
      label: mapPtyToLabel(precipitationType.value),
      basedOn: 'PTY',
      fcstDate: precipitationType.fcstDate,
      fcstTime: precipitationType.fcstTime,
    };
  }

  const skyState = pickClosestForecastValue(items, 'SKY', nowMs);
  if (!skyState) return null;

  return {
    label: mapSkyToLabel(skyState.value),
    basedOn: 'SKY',
    fcstDate: skyState.fcstDate,
    fcstTime: skyState.fcstTime,
  };
}

function mapSkyToLabel(code: number): string {
  switch (code) {
    case 1:
      return '맑음';
    case 3:
      return '구름많음';
    case 4:
      return '흐림';
    default:
      return '하늘';
  }
}

function mapPtyToLabel(code: number): string {
  switch (code) {
    case 1:
      return '비';
    case 2:
      return '비/눈';
    case 3:
      return '눈';
    case 4:
      return '소나기';
    default:
      return '강수';
  }
}
