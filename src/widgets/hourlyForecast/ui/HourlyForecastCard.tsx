import { WeatherConditionIcon, type HourlyForecastSlot } from '@/entities/weather';

interface HourlyForecastCardProps {
  slot: HourlyForecastSlot;
}

export function HourlyForecastCard({ slot }: HourlyForecastCardProps) {
  const highlightCard = slot.isCurrentHour;
  const title = highlightCard ? '지금' : slot.hourLabel;

  return (
    <article
      className={[
        'flex-none w-20 sm:w-24 md:w-28',
        'rounded-xl border px-3 py-4',
        highlightCard ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white',
      ].join(' ')}
      aria-label={`${title} 예보`}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center">
          <p
            className={[
              'text-sm',
              highlightCard ? 'font-semibold text-blue-700' : 'font-medium text-gray-900',
            ].join(' ')}
          >
            {title}
          </p>
        </div>

        {slot.conditionLabel ? (
          <WeatherConditionIcon label={slot.conditionLabel} className="w-10 h-10" />
        ) : (
          <div className="w-10 h-10" aria-hidden="true" />
        )}

        <p className="text-sm font-semibold text-gray-900">
          {slot.temperature !== null ? `${slot.temperature}°` : '-'}
        </p>
      </div>
    </article>
  );
}
