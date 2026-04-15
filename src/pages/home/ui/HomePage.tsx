import Border from '@/shared/ui/Border';
import { deriveCurrentCondition, deriveTemperatureSummary } from '@/entities/weather';
import { useHomeForecastQuery } from '../model/useHomeForecastQuery';
import { RegionSearch } from '@/features/regionSearch';
import WeatherSummary from '@/widgets/weatherSummary';
import HourlyForecastSection from '@/widgets/hourlyForecast';
import BookmarksSection from '@/widgets/bookmarks';
import { useNavigate } from 'react-router';
import type { KoreaRegionWithGrid } from '@/entities/region';
import { Suspense } from 'react';
import DeferredSpinner from '@/shared/ui/DeferredSpinner';

function HomePage() {
  const navigate = useNavigate();

  const handleSelectRegion = (region: KoreaRegionWithGrid) => {
    navigate(`/region/${encodeURIComponent(region.value)}`);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header>
        <h1 className="text-gray-900 font-bold text-2xl px-5 pt-5">날씨</h1>
      </header>

      <RegionSearch onSelect={handleSelectRegion} />

      <div className="flex-1 flex flex-col">
        <Suspense
          fallback={
            <div
              className="flex flex-1 items-center justify-center min-h-[40vh]"
              aria-label="날씨 로딩"
            >
              <DeferredSpinner />
            </div>
          }
        >
          <HomeForecastSections />
        </Suspense>
      </div>
    </main>
  );
}

function HomeForecastSections() {
  const { data } = useHomeForecastQuery();

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

  return (
    <>
      <WeatherSummary
        locationLabel={data?.locationLabel ?? '알 수 없음'}
        temperatureSummary={temperatureSummary}
        currentCondition={currentCondition}
      />

      <Border variant="spacer" />

      <HourlyForecastSection
        forecastItems={data?.forecastLatest.items.item ?? null}
        nowMs={data?.fetchedAtMs ?? 0}
      />

      <Border variant="spacer" />

      <BookmarksSection />
    </>
  );
}

export default HomePage;
