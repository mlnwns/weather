import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { convertLatLonToGrid } from '@/entities/weather/lib/convertLatLonToGrid';
import { getVillageForecast } from '@/entities/weather/api/getVillageForecast';
import { getForecastBaseDateTime } from '@/entities/weather/lib/getForecastBaseDateTime';
import { getDailyMinMaxBaseDateTime } from '@/entities/weather/lib/getDailyMinMaxBaseDateTime';
import { deriveCurrentCondition } from '@/entities/weather/lib/deriveCurrentCondition';
import { deriveTemperatureSummary } from '@/entities/weather/lib/deriveTemperatureSummary';
import { fetchIpinfoLocation } from '@/shared/api/ipinfo';
import Border from '@/shared/ui/Border';
import { getRegionLabelFromGrid } from '@/entities/location/lib/gridToRegion';

function HomePage() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['weather', 'forecast', 'ip'],
    staleTime: 1000 * 60 * 30,
    queryFn: async ({ signal }) => {
      const latestBase = getForecastBaseDateTime(new Date());
      const dailyMinMaxBase = getDailyMinMaxBaseDateTime(new Date());

      const ip = await fetchIpinfoLocation();

      const grid = convertLatLonToGrid(ip.lat, ip.lon);

      const forecastLatestPromise = getVillageForecast(
        {
          base_date: latestBase.base_date,
          base_time: latestBase.base_time,
          nx: grid.nx,
          ny: grid.ny,
        },
        { signal },
      );

      const isSameBase =
        latestBase.base_date === dailyMinMaxBase.base_date &&
        latestBase.base_time === dailyMinMaxBase.base_time;

      const forecastDailyMinMaxPromise = isSameBase
        ? forecastLatestPromise
        : getVillageForecast(
            {
              base_date: dailyMinMaxBase.base_date,
              base_time: dailyMinMaxBase.base_time,
              nx: grid.nx,
              ny: grid.ny,
            },
            { signal },
          );

      const regionLabel = getRegionLabelFromGrid(grid);

      const [forecastLatest, forecastDailyMinMax] = await Promise.all([
        forecastLatestPromise,
        forecastDailyMinMaxPromise,
      ]);

      const locationLabel = regionLabel ?? '알 수 없음';
      return {
        locationLabel,
        forecastLatest,
        forecastDailyMinMax,
        fetchedAtMs: Date.now(),
      };
    },
  });

  const temperatureSummary = useMemo(() => {
    if (!data) return null;

    return deriveTemperatureSummary(
      data.forecastLatest.items.item,
      data.fetchedAtMs,
      data.forecastDailyMinMax.items.item,
    );
  }, [data]);

  const currentCondition = useMemo(() => {
    if (!data) return null;

    return deriveCurrentCondition(data.forecastLatest.items.item, data.fetchedAtMs);
  }, [data]);

  return (
    <div>
      {isPending && <div>로딩 중</div>}
      {isError && <div>에러 발생</div>}

      {!isPending && !isError && data && (
        <div>
          <div>현재 위치: {data.locationLabel}</div>
          {temperatureSummary && (
            <div>
              <div>
                현재 기온(예보):{' '}
                {temperatureSummary.currentTemp ? `${temperatureSummary.currentTemp.value}°C` : '-'}
                {temperatureSummary.currentTemp
                  ? ` (기준 ${temperatureSummary.currentTemp.fcstTime.slice(0, 2)}:${temperatureSummary.currentTemp.fcstTime.slice(2, 4)})`
                  : ''}
              </div>
              <div>
                현재 날씨(예보): {currentCondition ? currentCondition.label : '-'}
                {currentCondition
                  ? ` (기준 ${currentCondition.fcstTime.slice(0, 2)}:${currentCondition.fcstTime.slice(2, 4)})`
                  : ''}
              </div>
              <Border variant="spacer" />
              <div>
                오늘 최저/최고(예보):{' '}
                {temperatureSummary.todayRange.min
                  ? `${temperatureSummary.todayRange.min.value}°C`
                  : '-'}{' '}
                /{' '}
                {temperatureSummary.todayRange.max
                  ? `${temperatureSummary.todayRange.max.value}°C`
                  : '-'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
