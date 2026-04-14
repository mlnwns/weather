import { useQuery } from '@tanstack/react-query';
import { convertLatLonToGrid, getRegionLabelFromGrid } from '@/entities/region';
import {
  getDailyMinMaxBaseDateTime,
  getForecastBaseDateTime,
  getVillageForecast,
} from '@/entities/weather';
import { fetchIpinfoLocation } from '@/shared/api/ipinfo';

type HomeForecastQueryData = {
  locationLabel: string;
  forecastLatest: Awaited<ReturnType<typeof getVillageForecast>>;
  forecastDailyMinMax: Awaited<ReturnType<typeof getVillageForecast>>;
  fetchedAtMs: number;
};

export function useHomeForecastQuery() {
  return useQuery<HomeForecastQueryData>({
    queryKey: ['weather', 'forecast', 'ip'],
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      const fetchedAt = new Date();
      const fetchedAtMs = fetchedAt.getTime();

      const latestBase = getForecastBaseDateTime(fetchedAt);
      const dailyMinMaxBase = getDailyMinMaxBaseDateTime(fetchedAt);

      const ip = await fetchIpinfoLocation();
      const grid = convertLatLonToGrid(ip.lat, ip.lon);

      const locationLabel = getRegionLabelFromGrid(grid) ?? '알 수 없음';

      const forecastLatestPromise = getVillageForecast({
        base_date: latestBase.base_date,
        base_time: latestBase.base_time,
        nx: grid.nx,
        ny: grid.ny,
      });

      const forecastDailyMinMaxPromise =
        latestBase.base_date === dailyMinMaxBase.base_date &&
        latestBase.base_time === dailyMinMaxBase.base_time
          ? forecastLatestPromise
          : getVillageForecast({
              base_date: dailyMinMaxBase.base_date,
              base_time: dailyMinMaxBase.base_time,
              nx: grid.nx,
              ny: grid.ny,
            });

      const [forecastLatest, forecastDailyMinMax] = await Promise.all([
        forecastLatestPromise,
        forecastDailyMinMaxPromise,
      ]);

      return {
        locationLabel,
        forecastLatest,
        forecastDailyMinMax,
        fetchedAtMs,
      };
    },
  });
}
