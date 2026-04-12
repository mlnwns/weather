import { publicDataClient, type PublicDataResponse } from '@/shared/api/publicDataClient';
import type { VillageForecastBody, VillageForecastParams } from '../model/weather.types';

export const getVillageForecast = async (
  params: VillageForecastParams,
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
