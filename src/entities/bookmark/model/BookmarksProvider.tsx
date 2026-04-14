import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { KoreaRegionWithGrid } from '@/entities/region';
import type { Bookmark } from './bookmark.types';
import {
  BOOKMARKS_MAX,
  BOOKMARKS_STORAGE_KEY,
  readBookmarks,
  writeBookmarks,
} from '../lib/bookmarkStorage';

type BookmarksContextValue = {
  bookmarks: Bookmark[];
  max: number;
  isFull: boolean;
  isBookmarked: (regionValue: string) => boolean;
  add: (region: KoreaRegionWithGrid) => void;
  remove: (regionValue: string) => void;
  updateAlias: (regionValue: string, alias: string) => void;
};

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

export function BookmarksProvider({ children }: PropsWithChildren) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => readBookmarks());

  useEffect(() => {
    writeBookmarks(bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== BOOKMARKS_STORAGE_KEY) return;
      setBookmarks(readBookmarks());
    };

    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const isFull = bookmarks.length >= BOOKMARKS_MAX;

  const isBookmarked = (regionValue: string) =>
    bookmarks.some((b) => b.regionValue === regionValue);

  const add = (region: KoreaRegionWithGrid) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.regionValue === region.value)) return prev;
      if (prev.length >= BOOKMARKS_MAX) return prev;

      const next: Bookmark = {
        regionValue: region.value,
        regionLabel: region.label,
        alias: region.label,
        createdAtMs: Date.now(),
      };

      return [...prev, next];
    });
  };

  const remove = (regionValue: string) => {
    setBookmarks((prev) => prev.filter((b) => b.regionValue !== regionValue));
  };

  const updateAlias = (regionValue: string, alias: string) => {
    const trimmed = alias.trim();

    setBookmarks((prev) =>
      prev.map((b) =>
        b.regionValue === regionValue ? { ...b, alias: trimmed || b.regionLabel } : b,
      ),
    );
  };

  const contextValue: BookmarksContextValue = {
    bookmarks,
    max: BOOKMARKS_MAX,
    isFull,
    isBookmarked,
    add,
    remove,
    updateAlias,
  };

  return <BookmarksContext.Provider value={contextValue}>{children}</BookmarksContext.Provider>;
}

export function useBookmarks() {
  const contextValue = useContext(BookmarksContext);
  if (!contextValue) {
    throw new Error('useBookmarks는 BookmarksProvider 안에서만 사용할 수 있습니다.');
  }
  return contextValue;
}
