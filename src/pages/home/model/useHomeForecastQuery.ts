import { useSuspenseQuery } from '@tanstack/react-query';
import { convertLatLonToGrid, getRegionLabelFromGrid } from '@/entities/region';
import { getForecastBaseDateTime, getVillageForecast } from '@/entities/weather';
import { fetchIpinfoLocation } from '@/shared/api/ipinfo';

type HomeForecastQueryData = {
  locationLabel: string;
  forecastLatest: Awaited<ReturnType<typeof getVillageForecast>>;
  forecastDailyMinMax: Awaited<ReturnType<typeof getVillageForecast>>;
  fetchedAtMs: number;
};

export function useHomeForecastQuery() {
  return useSuspenseQuery<HomeForecastQueryData>({
    queryKey: ['weather', 'forecast', 'ip'],
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      const fetchedAt = new Date();
      const fetchedAtMs = fetchedAt.getTime();

      const latestBase = getForecastBaseDateTime(fetchedAt);

      const ip = await fetchIpinfoLocation();
      const grid = convertLatLonToGrid(ip.lat, ip.lon);

      const locationLabel = getRegionLabelFromGrid(grid) ?? '알 수 없음';

      const forecastLatestPromise = getVillageForecast({
        base_date: latestBase.base_date,
        base_time: latestBase.base_time,
        nx: grid.nx,
        ny: grid.ny,
      });

      const forecastLatest = await forecastLatestPromise;
      const forecastDailyMinMax = forecastLatest;

      return {
        locationLabel,
        forecastLatest,
        forecastDailyMinMax,
        fetchedAtMs,
      };
    },
  });
}
