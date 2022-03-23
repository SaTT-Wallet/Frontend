export interface IresponseAuth {
  data: {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
  };
  message: string;
  blockedDate: number;
  code: number;
}
