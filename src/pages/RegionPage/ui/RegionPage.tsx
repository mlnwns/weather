import Border from '@/shared/ui/Border';
import ArrowIcon from '@/shared/ui/icons/ArrowIcon';
import { deriveCurrentCondition, deriveTemperatureSummary } from '@/entities/weather';
import { getKoreaRegionByValue } from '@/entities/region';
import { WeatherSummary } from '@/widgets/weatherSummary';
import { useNavigate, useParams } from 'react-router';
import { useRegionForecastQuery } from '../model/useRegionForecastQuery';

function RegionPage() {
  const navigate = useNavigate();
  const { regionValue = '' } = useParams();

  const decodedRegionValue = regionValue ? decodeURIComponent(regionValue) : '';
  const regionInfo = getKoreaRegionByValue(decodedRegionValue);

  const { data, isPending, isError } = useRegionForecastQuery(regionInfo);

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
    <main className="min-h-screen flex flex-col">
      <header className="px-5 pt-5">
        <button type="button" aria-label="뒤로가기" onClick={() => navigate('/')}>
          <ArrowIcon direction="left" className="w-5 h-5" />
        </button>
      </header>

      {!regionInfo && (
        <section className="w-full p-10" aria-label="지역 오류">
          <p className="text-center text-red-500 text-sm" role="alert">
            지역을 찾을 수 없어요
          </p>
        </section>
      )}

      {regionInfo && (
        <WeatherSummary
          isPending={isPending}
          isError={isError}
          locationLabel={regionInfo.label}
          temperatureSummary={temperatureSummary}
          currentCondition={currentCondition}
        />
      )}

      <Border variant="spacer" />
    </main>
  );
}

export default RegionPage;
