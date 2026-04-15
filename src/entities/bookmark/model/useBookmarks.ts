import { createContext, useContext } from 'react';
import type { KoreaRegionWithGrid } from '@/entities/region';
import type { Bookmark } from './bookmark.types';

export type BookmarksContextValue = {
  bookmarks: Bookmark[];
  max: number;
  isFull: boolean;
  isBookmarked: (regionValue: string) => boolean;
  add: (region: KoreaRegionWithGrid) => void;
  remove: (regionValue: string) => void;
  updateAlias: (regionValue: string, alias: string) => void;
};

export const BookmarksContext = createContext<BookmarksContextValue | null>(null);

export function useBookmarks() {
  const contextValue = useContext(BookmarksContext);
  if (!contextValue) {
    throw new Error('useBookmarks는 BookmarksProvider 안에서만 사용할 수 있습니다.');
  }
  return contextValue;
}
