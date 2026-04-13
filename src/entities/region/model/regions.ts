import rawRegions from '@/shared/assets/korea_regions_with_grid.json';
import type { KoreaRegionWithGrid } from './region.types';

export const koreaRegionsWithGrid = rawRegions as KoreaRegionWithGrid[];

const regionByValue = new Map<string, KoreaRegionWithGrid>(
  koreaRegionsWithGrid.map((region) => [region.value, region]),
);

export function getKoreaRegionByValue(value: string): KoreaRegionWithGrid | undefined {
  return regionByValue.get(value);
}
