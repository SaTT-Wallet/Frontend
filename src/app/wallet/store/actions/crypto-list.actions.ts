import { createAction, props } from '@ngrx/store';

export const loadCryptoLists = createAction(
  '[CryptoList] Load CryptoLists'
);

export const loadCryptoListsSuccess = createAction(
  '[CryptoList] Load CryptoLists Success',
  props<{ data: any }>()
);

export const loadCryptoListsFailure = createAction(
  '[CryptoList] Load CryptoLists Failure',
  props<{ error: any }>()
);

export const clearCryptoListsState = createAction(
  '[CryptoList] clear CryptoList Store'
);


