export interface IApiResponse<T> {
  code: number;
  data: T;
  message?: string;
  error?: string;
}
