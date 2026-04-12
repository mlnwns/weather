import { useQuery } from '@tanstack/react-query';
import type { VillageForecastParams } from '../model/weather.types';
import { getVillageForecast } from './getVillageForecast';

export const weatherKeys = {
  forecast: (params: VillageForecastParams) => ['weather', 'forecast', params] as const,
};

export const useVillageForecastQuery = (params: VillageForecastParams) => {
  return useQuery({
    queryKey: weatherKeys.forecast(params),
    queryFn: () => getVillageForecast(params),
    staleTime: 1000 * 60 * 30,
  });
};
