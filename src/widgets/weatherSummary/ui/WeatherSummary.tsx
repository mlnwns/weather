import { WeatherConditionIcon, deriveTemperatureSummary } from '@/entities/weather';
import type { CurrentCondition } from '@/entities/weather';
import type { ReactNode } from 'react';

type TemperatureSummary = ReturnType<typeof deriveTemperatureSummary>;

interface WeatherSummaryProps {
  isError?: boolean;
  locationLabel: string;
  titleRight?: ReactNode;
  temperatureSummary: TemperatureSummary | null;
  currentCondition: CurrentCondition;
}

function WeatherSummary({
  isError = false,
  locationLabel,
  titleRight,
  temperatureSummary,
  currentCondition,
}: WeatherSummaryProps) {
  return (
    <section className="w-full p-10" aria-label="날씨 요약">
      {isError && (
        <p className="text-center text-red-500 text-sm" role="alert">
          에러 발생
        </p>
      )}

      {!isError && (
        <section className="flex flex-col items-center gap-4" aria-label="현재 날씨">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">{locationLabel}</h2>
            {titleRight}
          </div>

          <WeatherConditionIcon label={currentCondition?.label} className="w-32 h-32" />

          <p className="text-6xl font-bold text-gray-900 ">
            {temperatureSummary?.currentTemp ? `${temperatureSummary.currentTemp.value}°` : '-'}
          </p>

          <p className="text-2xl font-medium text-gray-900">
            {currentCondition ? currentCondition.label : '-'}
          </p>

          <dl className="flex gap-4 text-base text-gray-500 mt-2">
            <dt>최저</dt>
            <dd className="font-semibold text-gray-900">
              {temperatureSummary?.todayRange.min
                ? `${temperatureSummary.todayRange.min.value}°`
                : '-'}
            </dd>

            <dt>최고</dt>
            <dd className="font-semibold text-gray-900">
              {temperatureSummary?.todayRange.max
                ? `${temperatureSummary.todayRange.max.value}°`
                : '-'}
            </dd>
          </dl>
        </section>
      )}
    </section>
  );
}

export default WeatherSummary;
