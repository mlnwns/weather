import { useSuspenseQuery } from '@tanstack/react-query';
import type { KoreaRegionWithGrid } from '@/entities/region';
import { getVillageForecast } from '../api/getVillageForecast';
import { getDailyMinMaxBaseDateTime } from '../lib/getDailyMinMaxBaseDateTime';
import { getForecastBaseDateTime } from '../lib/getForecastBaseDateTime';

type RegionForecastQueryData = {
  region: KoreaRegionWithGrid;
  forecastLatest: Awaited<ReturnType<typeof getVillageForecast>>;
  forecastDailyMinMax: Awaited<ReturnType<typeof getVillageForecast>>;
  fetchedAtMs: number;
};

export function useRegionForecastQuery(regionInfo: KoreaRegionWithGrid) {
  return useSuspenseQuery<RegionForecastQueryData>({
    queryKey: ['weather', 'forecast', 'region', regionInfo.value],
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
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
