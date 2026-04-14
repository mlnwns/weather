import { useQuery } from '@tanstack/react-query';
import {
  getDailyMinMaxBaseDateTime,
  getForecastBaseDateTime,
  getVillageForecast,
} from '@/entities/weather';
import type { KoreaRegionWithGrid } from '@/entities/region';

type RegionForecastQueryData = {
  region: KoreaRegionWithGrid;
  forecastLatest: Awaited<ReturnType<typeof getVillageForecast>>;
  forecastDailyMinMax: Awaited<ReturnType<typeof getVillageForecast>>;
  fetchedAtMs: number;
};

export function useRegionForecastQuery(regionInfo: KoreaRegionWithGrid | undefined) {
  return useQuery<RegionForecastQueryData>({
    queryKey: ['weather', 'forecast', 'region', regionInfo?.value],
    enabled: Boolean(regionInfo),
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      if (!regionInfo) throw new Error('Region is required');

      const fetchedAt = new Date();
      const fetchedAtMs = fetchedAt.getTime();

      const latestBase = getForecastBaseDateTime(fetchedAt);
      const dailyMinMaxBase = getDailyMinMaxBaseDateTime(fetchedAt);

      const forecastLatestPromise = getVillageForecast({
        base_date: latestBase.base_date,
        base_time: latestBase.base_time,
        nx: regionInfo.grid.nx,
        ny: regionInfo.grid.ny,
      });

      const forecastDailyMinMaxPromise =
        latestBase.base_date === dailyMinMaxBase.base_date &&
        latestBase.base_time === dailyMinMaxBase.base_time
          ? forecastLatestPromise
          : getVillageForecast({
              base_date: dailyMinMaxBase.base_date,
              base_time: dailyMinMaxBase.base_time,
              nx: regionInfo.grid.nx,
              ny: regionInfo.grid.ny,
            });

      const [forecastLatest, forecastDailyMinMax] = await Promise.all([
        forecastLatestPromise,
        forecastDailyMinMaxPromise,
      ]);

      return {
        region: regionInfo,
        forecastLatest,
        forecastDailyMinMax,
        fetchedAtMs,
      };
    },
  });
}
