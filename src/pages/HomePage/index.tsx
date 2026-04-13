import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { convertLatLonToGrid } from '@/entities/weather/lib/convertLatLonToGrid';
import { getVillageForecast } from '@/entities/weather/api/getVillageForecast';
import { getForecastBaseDateTime } from '@/entities/weather/lib/getForecastBaseDateTime';
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
      const { base_date, base_time } = getForecastBaseDateTime(new Date());

      const ip = await fetchIpinfoLocation();

      const grid = convertLatLonToGrid(ip.lat, ip.lon);

      const forecastPromise = getVillageForecast(
        {
          base_date,
          base_time,
          nx: grid.nx,
          ny: grid.ny,
        },
        { signal },
      );

      const regionLabel = getRegionLabelFromGrid(grid);

      const forecast = await forecastPromise;

      const locationLabel = regionLabel ?? '알 수 없음';
      return {
        source: 'ip' as const,
        ip,
        grid,
        locationLabel,
        forecast,
        fetchedAtMs: Date.now(),
      };
    },
  });

  const temperatureSummary = useMemo(() => {
    if (!data) return null;

    return deriveTemperatureSummary(data.forecast.items.item, data.fetchedAtMs);
  }, [data]);

  const currentCondition = useMemo(() => {
    if (!data) return null;

    return deriveCurrentCondition(data.forecast.items.item, data.fetchedAtMs);
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
