import Border from '@/shared/ui/Border';
import { deriveCurrentCondition } from '@/entities/weather/lib/deriveCurrentCondition';
import { deriveTemperatureSummary } from '@/entities/weather/lib/deriveTemperatureSummary';
import { useHomeForecastQuery } from '../model/useHomeForecastQuery';
import { RegionSearch } from '@/features/regionSearch';
import { WeatherSummary } from '@/widgets/weatherSummary';
import { useNavigate } from 'react-router';
import type { KoreaRegionWithGrid } from '@/entities/region';

function HomePage() {
  const { data, isPending, isError } = useHomeForecastQuery();
  const navigate = useNavigate();

  const temperatureSummary = data
    ? deriveTemperatureSummary(
        data.forecastLatest.items.item,
        data.fetchedAtMs,
        data.forecastDailyMinMax.items.item,
      )
    : null;

  const currentCondition = data
    ? deriveCurrentCondition(data.forecastLatest.items.item, data.fetchedAtMs)
    : null;

  const handleSelectRegion = (region: KoreaRegionWithGrid) => {
    navigate(`/region/${encodeURIComponent(region.value)}`);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header>
        <h1 className="text-gray-900 font-bold text-2xl px-5 pt-5">날씨</h1>
      </header>

      <RegionSearch onSelect={handleSelectRegion} />

      <WeatherSummary
        isPending={isPending}
        isError={isError}
        locationLabel={data?.locationLabel ?? '알 수 없음'}
        temperatureSummary={temperatureSummary}
        currentCondition={currentCondition}
      />

      <Border variant="spacer" />
    </main>
  );
}

export default HomePage;
