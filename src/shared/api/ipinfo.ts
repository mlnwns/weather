import axios from 'axios';

type IpinfoResponse = {
  loc?: string;
};

export type IpinfoLocation = {
  lat: number;
  lon: number;
};

export async function fetchIpinfoLocation(): Promise<IpinfoLocation> {
  const { data } = await axios.get<IpinfoResponse>('https://ipinfo.io/json');

  if (!data.loc) throw new Error('IP 위치 조회 실패');

  const parsed = parseLoc(data.loc);
  if (!parsed) throw new Error('IP 위치 조회 실패');

  return parsed;
}

function parseLoc(loc: string): IpinfoLocation | null {
  const [latStr, lonStr] = loc.split(',');

  const lat = Number(latStr);
  const lon = Number(lonStr);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  return { lat, lon };
}
