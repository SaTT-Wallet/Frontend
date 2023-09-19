
import { CryptoData } from '@app/models/crypto-data.model';
import { createAction, props } from '@ngrx/store';

export const loadCryptoData = createAction('[Crypto] Load Crypto Data');
export const loadCryptoDataSuccess = createAction(
  '[Crypto] Load Crypto Data Success',
  props<{ data: CryptoData[] }>()
);
export const loadCryptoDataFailure = createAction(
  '[Crypto] Load Crypto Data Failure',
  props<{ error: any }>()
);
