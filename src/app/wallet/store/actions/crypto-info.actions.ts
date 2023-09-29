import { createAction, props } from '@ngrx/store';


export const cryptoListLoaded = createAction(
  '[Crypto Info] Crypto List Loaded',
  props<{ cryptoList: any[] }>()
);

export const loadCryptoList = createAction('[CryptoInfo] Load Crypto List');
export const loadCryptoListSuccess = createAction(
  '[CryptoInfo] Load Crypto List Success',
  props<{ cryptoList: any[] }>() // Ensure that the type matches your state
);
export const loadCryptoListFailure = createAction(
  '[CryptoInfo] Load Crypto List Failure',
  props<{ error: any }>()
);
