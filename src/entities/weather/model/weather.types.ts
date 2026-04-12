export const FORECAST_CATEGORIES = [
  'TMP',
  'POP',
  'PTY',
  'PCP',
  'REH',
  'SKY',
  'SNO',
  'TMN',
  'TMX',
  'UUU',
  'VVV',
  'WAV',
  'VEC',
  'WSD',
] as const;

export type ForecastCategory = (typeof FORECAST_CATEGORIES)[number];

export interface VillageForecastItem {
  baseDate: string;
  baseTime: string;
  category: ForecastCategory;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

export interface VillageForecastBody {
  dataType: string;
  items: {
    item: VillageForecastItem[];
  };
  pageNo: number;
  numOfRows: number;
  totalCount: number;
}

export interface VillageForecastParams {
  base_date: string;
  base_time: string;
  nx: number;
  ny: number;
  numOfRows?: number;
  pageNo?: number;
}
