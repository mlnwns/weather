import { useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import SearchField from '@/shared/ui/SearchField';
import type { KoreaRegionWithGrid } from '@/entities/region';
import { koreaRegionsWithGrid, normalizeSearchQuery, searchKoreaRegions } from '@/entities/region';

const NO_REGION_MESSAGE = '해당 장소의 정보가 제공되지 않습니다.';

function findExactRegionByQuery(query: string): KoreaRegionWithGrid | null {
  const raw = query.trim();
  if (!raw) return null;

  const normalized = normalizeSearchQuery(raw);

  return (
    koreaRegionsWithGrid.find((region) => {
      if (region.value === raw) return true;
      if (region.label === raw) return true;
      if (region.searchKey === normalized) return true;
      return false;
    }) ?? null
  );
}

interface RegionSearchProps {
  onSelect: (region: KoreaRegionWithGrid) => void;
  placeholder?: string;
}

export function RegionSearch({ onSelect, placeholder = '지역을 검색하세요' }: RegionSearchProps) {
  const lastNavKeyRef = useRef<{ key: 'ArrowDown' | 'ArrowUp'; timeStamp: number } | null>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = useMemo(() => {
    return searchKoreaRegions(koreaRegionsWithGrid, query, 8);
  }, [query]);

  const resolvedActiveIndex =
    suggestions.length === 0
      ? -1
      : activeIndex < 0
        ? -1
        : Math.min(activeIndex, suggestions.length - 1);

  const showDropdown = isOpen && (Boolean(errorMessage) || suggestions.length > 0);
  const showSuggestions = showDropdown && !errorMessage && suggestions.length > 0;

  const focusInputWithin = (container: HTMLElement) => {
    const input = container.querySelector('input');
    if (input instanceof HTMLInputElement) input.focus();
  };

  const resetActive = () => setActiveIndex(-1);

  const closeDropdown = () => {
    setIsOpen(false);
    resetActive();
  };

  const selectRegion = (region: KoreaRegionWithGrid) => {
    setErrorMessage(null);
    onSelect(region);
    closeDropdown();
  };

  const shouldIgnoreDuplicateNavKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.repeat) return false;
    const last = lastNavKeyRef.current;
    if (last && last.key === e.key && e.timeStamp - last.timeStamp < 40) {
      return true;
    }
    lastNavKeyRef.current = { key: e.key as 'ArrowDown' | 'ArrowUp', timeStamp: e.timeStamp };
    return false;
  };

  const handleArrowNavigation = (e: KeyboardEvent<HTMLDivElement>) => {
    if (suggestions.length === 0) return;
    if (shouldIgnoreDuplicateNavKey(e)) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
    setErrorMessage(null);

    setActiveIndex((prev) => {
      const maxIndex = suggestions.length - 1;
      const clampedPrev = prev < 0 ? -1 : Math.min(prev, maxIndex);

      if (e.key === 'ArrowDown') {
        return clampedPrev < 0 ? 0 : Math.min(clampedPrev + 1, maxIndex);
      }

      if (clampedPrev <= 0) return -1;
      return clampedPrev - 1;
    });
  };

  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (resolvedActiveIndex >= 0 && resolvedActiveIndex < suggestions.length) {
      const selected = suggestions[resolvedActiveIndex];
      if (selected) {
        e.preventDefault();
        selectRegion(selected);
        return;
      }
    }

    const exact = findExactRegionByQuery(query);
    if (exact) {
      selectRegion(exact);
      return;
    }

    setErrorMessage(NO_REGION_MESSAGE);
    setIsOpen(true);
  };

  return (
    <div
      className="w-full"
      onFocusCapture={() => setIsOpen(true)}
      onBlurCapture={(e) => {
        const next = e.relatedTarget;
        if (next instanceof Node && e.currentTarget.contains(next)) return;
        closeDropdown();
      }}
      onKeyDown={(e) => {
        const isTypingInInput = e.target instanceof HTMLInputElement;
        if (!isTypingInInput) return;

        if (e.key === 'Escape') {
          setErrorMessage(null);
          closeDropdown();
          focusInputWithin(e.currentTarget);
          return;
        }

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          handleArrowNavigation(e);
          return;
        }

        if (e.key === 'Enter') {
          handleEnter(e);
        }
      }}
    >
      <div className="relative">
        <SearchField
          value={query}
          onChange={(value) => {
            setQuery(value);
            setIsOpen(true);
            setErrorMessage(null);
            resetActive();
          }}
          placeholder={placeholder}
        />

        {showDropdown && (
          <div className="absolute left-0 right-0 z-10">
            <div className="px-5">
              {errorMessage && (
                <div
                  className="mt-2 rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-red-500"
                  role="alert"
                >
                  {errorMessage}
                </div>
              )}

              {showSuggestions && (
                <ul
                  className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                  aria-label="추천 검색어"
                >
                  {suggestions.map((region, index) => (
                    <li key={region.value}>
                      <button
                        type="button"
                        className={
                          'w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-200 focus:bg-gray-200 outline-none ' +
                          (resolvedActiveIndex === index ? 'bg-gray-200' : '')
                        }
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        onClick={() => {
                          selectRegion(region);
                        }}
                        aria-selected={resolvedActiveIndex === index}
                      >
                        {region.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
