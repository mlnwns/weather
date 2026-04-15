import Border from '@/shared/ui/Border';
import ArrowIcon from '@/shared/ui/icons/ArrowIcon';
import { deriveCurrentCondition, deriveTemperatureSummary } from '@/entities/weather';
import { getKoreaRegionByValue } from '@/entities/region';
import WeatherSummary from '@/widgets/weatherSummary';
import HourlyForecastSection from '@/widgets/hourlyForecast';
import { useNavigate, useParams } from 'react-router';
import { useRegionForecastQuery } from '@/entities/weather';
import BookmarkFilledIcon from '@/shared/assets/icons/bookmark_filled.svg';
import BookmarkOutlineIcon from '@/shared/assets/icons/bookmark_outline.svg';
import { useBookmarks } from '@/entities/bookmark';
import { Suspense } from 'react';
import DeferredSpinner from '@/shared/ui/DeferredSpinner';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import ErrorBoundary from '@/shared/ui/ErrorBoundary';

function RegionPage() {
  const navigate = useNavigate();
  const { regionValue = '' } = useParams();

  const { add, remove, isBookmarked, isFull } = useBookmarks();

  const decodedRegionValue = regionValue ? decodeURIComponent(regionValue) : '';
  const regionInfo = getKoreaRegionByValue(decodedRegionValue);

  const bookmarked = regionInfo ? isBookmarked(regionInfo.value) : false;
  const isAddBlockedByLimit = regionInfo ? !bookmarked && isFull : false;

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
        <div className="flex-1 flex flex-col">
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                title="날씨를 불러오지 못했어요"
              >
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
                  <RegionForecastSections
                    regionInfo={regionInfo}
                    bookmarked={bookmarked}
                    isAddBlockedByLimit={isAddBlockedByLimit}
                    onToggleBookmark={() => {
                      if (bookmarked) {
                        remove(regionInfo.value);
                      } else if (isAddBlockedByLimit) {
                        alert('즐겨찾기는 최대 6개까지 추가할 수 있어요.');
                      } else {
                        add(regionInfo);
                      }
                    }}
                  />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </div>
      )}
    </main>
  );
}

function RegionForecastSections({
  regionInfo,
  bookmarked,
  isAddBlockedByLimit,
  onToggleBookmark,
}: {
  regionInfo: NonNullable<ReturnType<typeof getKoreaRegionByValue>>;
  bookmarked: boolean;
  isAddBlockedByLimit: boolean;
  onToggleBookmark: () => void;
}) {
  const { data } = useRegionForecastQuery(regionInfo);

  const temperatureSummary = deriveTemperatureSummary(
    data.forecastLatest.items.item,
    data.fetchedAtMs,
    data.forecastDailyMinMax.items.item,
  );

  const currentCondition = deriveCurrentCondition(data.forecastLatest.items.item, data.fetchedAtMs);

  return (
    <>
      <WeatherSummary
        locationLabel={regionInfo.label}
        titleRight={
          <button
            type="button"
            aria-label={bookmarked ? '즐겨찾기 삭제' : '즐겨찾기 추가'}
            onClick={onToggleBookmark}
            title={
              isAddBlockedByLimit
                ? '즐겨찾기는 최대 6개까지 추가할 수 있어요.'
                : bookmarked
                  ? '즐겨찾기 삭제'
                  : '즐겨찾기 추가'
            }
            className={
              'ml-1 w-8 h-8 grid place-items-center rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors ' +
              (isAddBlockedByLimit ? 'opacity-60' : '')
            }
          >
            <img
              src={bookmarked ? BookmarkFilledIcon : BookmarkOutlineIcon}
              alt=""
              aria-hidden
              className="w-5 h-5"
            />
          </button>
        }
        temperatureSummary={temperatureSummary}
        currentCondition={currentCondition}
      />

      <Border variant="spacer" />

      <HourlyForecastSection
        forecastItems={data.forecastLatest.items.item}
        nowMs={data.fetchedAtMs}
      />
    </>
  );
}

export default RegionPage;
