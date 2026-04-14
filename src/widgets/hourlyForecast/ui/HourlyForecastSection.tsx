import { useEffect, useRef, useState } from 'react';
import ArrowIcon from '@/shared/ui/icons/ArrowIcon';
import { deriveHourlyForecastSlots, type VillageForecastItem } from '@/entities/weather';
import { HourlyForecastCard } from './HourlyForecastCard';

interface HourlyForecastSectionProps {
  isPending: boolean;
  isError: boolean;
  forecastItems: VillageForecastItem[] | null;
  nowMs: number;
}

function HourlyForecastSection({
  isPending,
  isError,
  forecastItems,
  nowMs,
}: HourlyForecastSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const slots = forecastItems ? deriveHourlyForecastSlots(forecastItems, nowMs) : [];

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < maxScrollLeft - 1);
    };

    update();

    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [slots.length]);

  const handleScrollBy = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const delta = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -delta : delta, behavior: 'smooth' });
  };

  return (
    <section className="w-full p-10" aria-label="시간대별 날씨">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">시간대별 날씨</h2>
      </header>

      {isPending && (
        <p className="mt-4 text-center text-gray-500 text-sm" role="status">
          로딩 중
        </p>
      )}

      {isError && (
        <p className="mt-4 text-center text-red-500 text-sm" role="alert">
          에러 발생
        </p>
      )}

      {!isPending && !isError && (
        <div className="relative mt-4">
          {canScrollLeft && (
            <button
              type="button"
              aria-label="이전 시간대"
              onClick={() => handleScrollBy('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-9 h-9 rounded-full bg-white border border-gray-300 pr-1 cursor-pointer"
            >
              <ArrowIcon direction="left" className="w-4 h-4" />
            </button>
          )}

          {canScrollRight && (
            <button
              type="button"
              aria-label="다음 시간대"
              onClick={() => handleScrollBy('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-9 h-9 rounded-full bg-white border border-gray-300 pl-1 cursor-pointer"
            >
              <ArrowIcon direction="right" className="w-4 h-4" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth px-1"
            aria-label="시간대별 예보 목록"
          >
            {slots.map((slot) => (
              <HourlyForecastCard key={slot.epochMs} slot={slot} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default HourlyForecastSection;
