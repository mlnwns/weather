import type { KoreaRegionWithGrid } from '../model/region.types';

const INITIAL_CONSONANTS = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
] as const;

export function searchKoreaRegions(
  regions: KoreaRegionWithGrid[],
  query: string,
  maxResults = 8,
): KoreaRegionWithGrid[] {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return [];

  const enableInitialsMatch = hasInitialConsonantChar(normalized);
  const isJamoOnlyQuery = enableInitialsMatch && !hasHangulSyllable(normalized);
  const queryInitials = enableInitialsMatch ? toInitialConsonants(normalized) : '';

  const matches = regions
    .map((region) => {
      const labelCompact = region.label.replace(/\s/g, '');

      if (region.searchKey.startsWith(normalized)) return { region, rank: 0 };
      if (labelCompact.startsWith(normalized)) return { region, rank: 1 };
      if (region.searchKey.includes(normalized)) return { region, rank: 2 };
      if (labelCompact.includes(normalized)) return { region, rank: 3 };

      if (enableInitialsMatch) {
        if (isJamoOnlyQuery) {
          if (getRegionLeafInitials(region).startsWith(queryInitials)) {
            return { region, rank: 4 };
          }
        } else {
          if (getRegionInitials(region).includes(queryInitials)) {
            return { region, rank: 4 };
          }
        }
      }

      return null;
    })
    .filter((v): v is { region: KoreaRegionWithGrid; rank: number } => v !== null);

  return matches
    .slice()
    .sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      if (a.rank === 4 && isJamoOnlyQuery) {
        const p = getLeafSuffixPriority(a.region) - getLeafSuffixPriority(b.region);
        if (p !== 0) return p;
      }
      return a.region.label.length - b.region.label.length;
    })
    .map((m) => m.region)
    .slice(0, maxResults);
}

export function normalizeSearchQuery(query: string): string {
  return query.replace(/[\s-]/g, '').trim();
}

function hasInitialConsonantChar(query: string): boolean {
  return /[\u3131-\u314e]/.test(query);
}

function hasHangulSyllable(query: string): boolean {
  return /[\uac00-\ud7a3]/.test(query);
}

function toInitialConsonants(text: string): string {
  const compact = text.replace(/[\s-]/g, '');
  let out = '';

  for (const ch of compact) {
    const code = ch.charCodeAt(0);

    if (code >= 0xac00 && code <= 0xd7a3) {
      const syllableIndex = code - 0xac00;
      const initialIndex = Math.floor(syllableIndex / 588);
      out += INITIAL_CONSONANTS[initialIndex] ?? ch;
      continue;
    }

    out += ch;
  }

  return out;
}

const regionInitialsCache = new Map<string, string>();
const regionLeafInitialsCache = new Map<string, string>();

function getRegionInitials(region: KoreaRegionWithGrid): string {
  const cached = regionInitialsCache.get(region.value);
  if (cached) return cached;

  const initials = toInitialConsonants(region.label);
  regionInitialsCache.set(region.value, initials);
  return initials;
}

function getRegionLeafInitials(region: KoreaRegionWithGrid): string {
  const cached = regionLeafInitialsCache.get(region.value);
  if (cached) return cached;

  const leaf = region.path[region.path.length - 1] ?? region.label;
  const initials = toInitialConsonants(leaf);
  regionLeafInitialsCache.set(region.value, initials);
  return initials;
}

function getLeafSuffixPriority(region: KoreaRegionWithGrid): number {
  const leaf = region.path[region.path.length - 1] ?? '';
  const suffix = leaf.slice(-1);

  switch (suffix) {
    case '시':
      return 0;
    case '구':
      return 1;
    case '동':
      return 2;
    case '군':
      return 3;
    case '읍':
      return 4;
    case '면':
      return 5;
    case '리':
      return 6;
    case '도':
      return 7;
    default:
      return 8;
  }
}
