export type KoreaRegionGrid = {
  nx: number;
  ny: number;
};

export type KoreaRegionWithGrid = {
  path: string[];
  value: string;
  label: string;
  searchKey: string;
  grid: KoreaRegionGrid;
};
