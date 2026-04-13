import type { KoreaRegionGrid } from '../model/region.types';

const EARTH_RADIUS = 6371.00877;
const GRID = 5.0;
const STANDARD_LAT_1 = 30.0;
const STANDARD_LAT_2 = 60.0;
const ORIGIN_LAT = 38.0;
const ORIGIN_LON = 126.0;
const ORIGIN_X = 43;
const ORIGIN_Y = 136;

export const convertLatLonToGrid = (lat: number, lon: number): KoreaRegionGrid => {
  const DEGRAD = Math.PI / 180.0;

  const re = EARTH_RADIUS / GRID;
  const slat1 = STANDARD_LAT_1 * DEGRAD;
  const slat2 = STANDARD_LAT_2 * DEGRAD;
  const olon = ORIGIN_LON * DEGRAD;
  const olat = ORIGIN_LAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;

  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  const ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  const r = (re * sf) / Math.pow(ra, sn);

  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(r * Math.sin(theta) + ORIGIN_X + 0.5);
  const ny = Math.floor(ro - r * Math.cos(theta) + ORIGIN_Y + 0.5);

  return { nx, ny };
};
