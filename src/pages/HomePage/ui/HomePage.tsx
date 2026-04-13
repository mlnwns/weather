import Border from '@/shared/ui/Border';
import { deriveCurrentCondition } from '@/entities/weather/lib/deriveCurrentCondition';
import { deriveTemperatureSummary } from '@/entities/weather/lib/deriveTemperatureSummary';
import { useHomeForecastQuery } from '../model/useHomeForecastQuery';

function HomePage() {
  const { data, isPending, isError } = useHomeForecastQuery();

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
      <header>
        <h1 className="text-gray-900 font-bold text-2xl px-5 pt-5">날씨</h1>
      </header>

      <section className="w-full p-6" aria-label="날씨 요약">
        {isPending && (
          <p className="text-center text-gray-500 text-sm" role="status">
            로딩 중
          </p>
        )}

        {isError && (
          <p className="text-center text-red-500 text-sm" role="alert">
            에러 발생
          </p>
        )}

        {!isPending && !isError && data && (
          <section className="flex flex-col items-center gap-4" aria-label="현재 날씨">
            <h2 className="text-xl font-semibold text-gray-900">{data.locationLabel}</h2>

            {temperatureSummary && (
              <>
                <p className="text-6xl font-bold text-gray-900 ">
                  {temperatureSummary.currentTemp
                    ? `${temperatureSummary.currentTemp.value}°`
                    : '-'}
                </p>

                <p className="text-2xl font-medium text-gray-900">
                  {currentCondition ? currentCondition.label : '-'}
                </p>

                <dl className="flex gap-4 text-base text-gray-500 mt-2">
                  <dt>최저</dt>
                  <dd className="font-semibold text-gray-900">
                    {temperatureSummary.todayRange.min
                      ? `${temperatureSummary.todayRange.min.value}°`
                      : '-'}
                  </dd>

                  <dt>최고</dt>
                  <dd className="font-semibold text-gray-900">
                    {temperatureSummary.todayRange.max
                      ? `${temperatureSummary.todayRange.max.value}°`
                      : '-'}
                  </dd>
                </dl>
              </>
            )}
          </section>
        )}
      </section>

      <Border variant="spacer" />
    </main>
  );
}

export default HomePage;
