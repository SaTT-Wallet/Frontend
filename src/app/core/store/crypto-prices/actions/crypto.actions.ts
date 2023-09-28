import { createAction, props } from '@ngrx/store';

export const fetchCryptoPriceList = createAction('[Crypto] Fetch Price List');
export const fetchCryptoPriceListSuccess = createAction(
  '[Crypto] Fetch Price List Success',
  props<{ cryptoPriceList: any }>()
);

export const fetchCryptoPriceListFailure = createAction(
  '[Crypto] Fetch Price List Failure',
  props<{ error: any }>()
);
