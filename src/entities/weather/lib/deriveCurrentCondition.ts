import type { VillageForecastItem } from '../model/weather.types';
import { pickClosestForecastValue } from './toForecastValueAtTime';
import { mapPtyToLabel, mapSkyToLabel } from './conditionLabels';

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
