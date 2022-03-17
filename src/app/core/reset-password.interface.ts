export interface IResetPasswordResponse {
  code: number;
  data: { [key: string]: string | number | boolean };
  error?: string;
  message?: string;
}
