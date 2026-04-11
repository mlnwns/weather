import axios, { type AxiosResponse } from 'axios';

export type PublicDataResponse<T> = {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: T;
  };
};

const PUBLIC_DATA_SUCCESS_CODE = '00';
const PUBLIC_DATA_REQUEST_TIMEOUT = 8000;

export const publicDataClient = axios.create({
  baseURL: import.meta.env.VITE_DATA_GO_KR_BASE_URL,
  timeout: PUBLIC_DATA_REQUEST_TIMEOUT,
  params: {
    serviceKey: import.meta.env.VITE_DATA_GO_KR_API_KEY,
    dataType: 'JSON',
  },
});

publicDataClient.interceptors.response.use(
  (response: AxiosResponse<PublicDataResponse<unknown>>) => {
    const apiResponse = response.data?.response;

    if (!apiResponse) {
      return Promise.reject(new Error('응답 구조가 올바르지 않습니다.'));
    }

    const { header } = apiResponse;

    if (header.resultCode !== PUBLIC_DATA_SUCCESS_CODE) {
      return Promise.reject(new Error(header.resultMsg ?? '알 수 없는 오류입니다.'));
    }

    return response;
  },
  (error) => {
    if (error instanceof Error) return Promise.reject(error);
    return Promise.reject(new Error('네트워크 요청에 실패했습니다.'));
  },
);
