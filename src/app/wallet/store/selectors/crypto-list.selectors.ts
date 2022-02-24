import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromCryptoListReducer from '@wallet/store/reducers/crypto-list.reducer'

export const selectFromCryptoListFeatureKey =
  createFeatureSelector<fromCryptoListReducer.CryptoListState>(
    fromCryptoListReducer.cryptoListFeatureKey
  );

export const selectCryptoList = createSelector(
    selectFromCryptoListFeatureKey,
  (state: fromCryptoListReducer.CryptoListState) => state.cryptoList
);