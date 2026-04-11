import { publicDataClient } from '@/shared/api/publicDataClient';
import type { VillageForecastBody } from '../model/weather.types';
import type { PublicDataResponse } from '@/shared/api/publicDataClient.types';

interface GetVillageForecastParams {
  base_date: string;
  base_time: string;
  nx: number;
  ny: number;
  numOfRows?: number;
  pageNo?: number;
}

export const getVillageForecast = async (
  params: GetVillageForecastParams,
): Promise<VillageForecastBody> => {
  const response = await publicDataClient.get<PublicDataResponse<VillageForecastBody>>(
    '/1360000/VilageFcstInfoService_2.0/getVilageFcst',
    {
      params: {
        ...params,
        numOfRows: params.numOfRows ?? 1000,
        pageNo: params.pageNo ?? 1,
      },
    },
  );

  return response.data.response.body;
};
