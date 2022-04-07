import { createAction, props } from '@ngrx/store';
export const loadUpdatedKyc = createAction('[Kyc] Load kyc');

export const loadKyc = createAction('[Kyc] load Kyc');

export const loadKycSuccess = createAction(
  '[Kyc] load Kycs Success',
  props<{ data: any }>()
);

export const loadKycFailure = createAction(
  '[Kyc] load Kycs Failure',
  props<{ error: any }>()
);
export const loadKycLogout = createAction('[Kyc] Load Kyc Logout');
