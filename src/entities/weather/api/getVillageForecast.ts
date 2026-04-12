import { publicDataClient, type PublicDataResponse } from '@/shared/api/publicDataClient';
import type { VillageForecastBody, VillageForecastParams } from '../model/weather.types';

const DEFAULT_FORECAST_ROWS = 310;
const DEFAULT_PAGE_NUMBER = 1;

export const getVillageForecast = async (
  params: VillageForecastParams,
  options?: {
    signal?: AbortSignal;
  },
): Promise<VillageForecastBody> => {
  const response = await publicDataClient.get<PublicDataResponse<VillageForecastBody>>(
    '/1360000/VilageFcstInfoService_2.0/getVilageFcst',
    {
      params: {
        ...params,
        numOfRows: params.numOfRows ?? DEFAULT_FORECAST_ROWS,
        pageNo: params.pageNo ?? DEFAULT_PAGE_NUMBER,
      },
      signal: options?.signal,
    },
  );

  return response.data.response.body;
};
