import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CryptoState } from '../reducer/crypto.reducer';

const selectCryptoState = createFeatureSelector<CryptoState>('cryptoPriceList');

export const selectCryptoPriceList = createSelector(
  selectCryptoState,
  (state) => state.cryptoPriceList
);
