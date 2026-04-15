import { useSuspenseQuery } from '@tanstack/react-query';
import type { KoreaRegionWithGrid } from '@/entities/region';
import { getVillageForecast } from '../api/getVillageForecast';
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

      const forecastLatestPromise = getVillageForecast({
        base_date: latestBase.base_date,
        base_time: latestBase.base_time,
        nx: regionInfo.grid.nx,
        ny: regionInfo.grid.ny,
      });

      const forecastLatest = await forecastLatestPromise;
      const forecastDailyMinMax = forecastLatest;

      return {
        region: regionInfo,
        forecastLatest,
        forecastDailyMinMax,
        fetchedAtMs,
      };
    },
  });
}
