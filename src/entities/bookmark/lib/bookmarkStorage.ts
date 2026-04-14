import type { Bookmark } from '../model/bookmark.types';

export const BOOKMARKS_STORAGE_KEY = 'bookmarks';
export const BOOKMARKS_MAX = 6;

export function readBookmarks(): Bookmark[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];

  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isBookmarkRecord).slice(0, BOOKMARKS_MAX);
  } catch {
    return [];
  }
}

export function writeBookmarks(bookmarks: Bookmark[]) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks.slice(0, BOOKMARKS_MAX)));
}

function isBookmarkRecord(value: unknown): value is Bookmark {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.regionValue === 'string' &&
    typeof v.regionLabel === 'string' &&
    typeof v.alias === 'string' &&
    typeof v.createdAtMs === 'number'
  );
}
