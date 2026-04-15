import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router';
import EditIcon from '@/shared/assets/icons/edit.svg';
import CheckIcon from '@/shared/assets/icons/check.svg';
import TrashIcon from '@/shared/assets/icons/trash.svg';
import { getKoreaRegionByValue } from '@/entities/region';
import {
  deriveCurrentCondition,
  deriveTemperatureSummary,
  useRegionForecastQuery,
  WeatherConditionIcon,
} from '@/entities/weather';
import type { KoreaRegionWithGrid } from '@/entities/region';
import { useBookmarks, type Bookmark } from '@/entities/bookmark';

interface BookmarkCardProps {
  bookmark: Bookmark;
}

function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const navigate = useNavigate();
  const { remove, updateAlias } = useBookmarks();

  const regionInfo = getKoreaRegionByValue(bookmark.regionValue);
  const [isEditing, setIsEditing] = useState(false);
  const [draftAlias, setDraftAlias] = useState('');

  const handleNavigate = () => {
    navigate(`/region/${encodeURIComponent(bookmark.regionValue)}`);
  };

  const commitAlias = () => {
    updateAlias(bookmark.regionValue, draftAlias);
    setIsEditing(false);
  };

  const cancelAlias = () => {
    setDraftAlias(bookmark.alias);
    setIsEditing(false);
  };

  return (
    <article
      className="w-full rounded-xl border border-gray-200 bg-white p-3 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNavigate();
        }
      }}
      aria-label={`${bookmark.alias} 즐겨찾기 카드`}
    >
      <header className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          {!isEditing && (
            <div className="h-8 flex items-center min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{bookmark.alias}</h3>
            </div>
          )}

          {isEditing && (
            <input
              value={draftAlias}
              onChange={(e) => setDraftAlias(e.target.value)}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') commitAlias();
                if (e.key === 'Escape') cancelAlias();
              }}
              onBlur={commitAlias}
              className="w-full h-8 text-sm font-semibold text-gray-900 bg-transparent outline-none border-b border-gray-300"
              aria-label="즐겨찾기 별칭 수정"
            />
          )}
        </div>

        <div className="flex items-center gap-0 shrink-0">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (isEditing) commitAlias();
              else {
                setDraftAlias(bookmark.alias);
                setIsEditing(true);
              }
            }}
            aria-label={isEditing ? '별칭 저장' : '별칭 편집'}
            className="w-8 h-8 grid place-items-center rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors cursor-pointer"
          >
            <img src={isEditing ? CheckIcon : EditIcon} alt="" aria-hidden className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              remove(bookmark.regionValue);
            }}
            aria-label="즐겨찾기 삭제"
            className="w-8 h-8 grid place-items-center rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors cursor-pointer"
          >
            <img src={TrashIcon} alt="" aria-hidden className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="mt-3">
        {regionInfo ? (
          <Suspense
            fallback={
              <div
                className="min-h-16 flex items-center justify-center"
                aria-label="즐겨찾기 날씨 로딩"
              >
                <p className="text-center text-gray-500 text-xs">불러오는 중</p>
              </div>
            }
          >
            <BookmarkCardForecast regionInfo={regionInfo} />
          </Suspense>
        ) : (
          <p className="text-center text-red-500 text-xs" role="alert">
            지역을 찾을 수 없어요
          </p>
        )}
      </div>
    </article>
  );
}

function BookmarkCardForecast({ regionInfo }: { regionInfo: KoreaRegionWithGrid }) {
  const { data } = useRegionForecastQuery(regionInfo);

  const temperatureSummary = deriveTemperatureSummary(
    data.forecastLatest.items.item,
    data.fetchedAtMs,
    data.forecastDailyMinMax.items.item,
  );

  const currentCondition = deriveCurrentCondition(data.forecastLatest.items.item, data.fetchedAtMs);

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <WeatherConditionIcon label={currentCondition?.label} className="w-10 h-10" />
        <p className="text-2xl font-bold text-gray-900">
          {temperatureSummary?.currentTemp ? `${temperatureSummary.currentTemp.value}°` : '-'}
        </p>
      </div>

      <dl className="mt-2 flex justify-center gap-3 text-xs text-gray-500">
        <dt>최저</dt>
        <dd className="font-semibold text-gray-900">
          {temperatureSummary?.todayRange.min ? `${temperatureSummary.todayRange.min.value}°` : '-'}
        </dd>

        <dt>최고</dt>
        <dd className="font-semibold text-gray-900">
          {temperatureSummary?.todayRange.max ? `${temperatureSummary.todayRange.max.value}°` : '-'}
        </dd>
      </dl>
    </>
  );
}

export default BookmarkCard;
