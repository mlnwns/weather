export type {
  VillageForecastItem,
  VillageForecastBody,
  VillageForecastParams,
} from './model/weather.types';

export { getVillageForecast } from './api/getVillageForecast';

export { deriveCurrentCondition } from './lib/deriveCurrentCondition';
export type { CurrentCondition } from './lib/deriveCurrentCondition';

export { deriveTemperatureSummary } from './lib/deriveTemperatureSummary';
export { getDailyMinMaxBaseDateTime } from './lib/getDailyMinMaxBaseDateTime';
export { getForecastBaseDateTime } from './lib/getForecastBaseDateTime';

export { deriveHourlyForecastSlots } from './lib/deriveHourlyForecastSlots';
export type { HourlyForecastSlot } from './lib/deriveHourlyForecastSlots';

export { WeatherConditionIcon } from './ui/WeatherConditionIcon';
