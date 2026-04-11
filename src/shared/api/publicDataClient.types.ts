export type PublicDataResponse<T> = {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: T;
  };
};
