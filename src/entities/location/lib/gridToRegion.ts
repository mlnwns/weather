import gridToRegionMapData from '@/shared/assets/korea_grid_to_regions.json';

export type Grid = { nx: number; ny: number };
type GridKey = keyof typeof gridToRegionMapData;

const regionLabelMap = new Map<GridKey, string>(
  Object.entries(gridToRegionMapData) as [GridKey, string][],
);

export function toGridKey({ nx, ny }: Grid): GridKey {
  return `${nx},${ny}` as GridKey;
}

export function getRegionLabelFromGrid(grid: Grid): string | null {
  return regionLabelMap.get(toGridKey(grid)) ?? null;
}
