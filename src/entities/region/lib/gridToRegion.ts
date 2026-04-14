import gridToRegionMapData from '@/shared/assets/korea_grid_to_regions.json';
import type { KoreaRegionGrid } from '../model/region.types';

type GridKey = keyof typeof gridToRegionMapData;

const regionLabelMap = new Map<GridKey, string>(
  Object.entries(gridToRegionMapData) as [GridKey, string][],
);

function toGridKey(grid: KoreaRegionGrid): GridKey {
  return `${grid.nx},${grid.ny}` as GridKey;
}

export function getRegionLabelFromGrid(grid: KoreaRegionGrid): string | null {
  return regionLabelMap.get(toGridKey(grid)) ?? null;
}
