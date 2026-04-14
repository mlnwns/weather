export type { KoreaRegionGrid, KoreaRegionWithGrid } from './model/region.types';
export { koreaRegionsWithGrid, getKoreaRegionByValue } from './model/regions';
export { searchKoreaRegions, normalizeSearchQuery } from './lib/searchRegions';
export { convertLatLonToGrid } from './lib/convertLatLonToGrid';
export { getRegionLabelFromGrid } from './lib/gridToRegion';
