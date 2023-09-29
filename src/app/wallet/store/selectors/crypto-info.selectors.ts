import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromCryptoInfo from '../reducers/crypto-info.reducer';
import { cryptoInfoFeatureKey } from '../reducers/crypto-info.reducer';
import { CryptoInfoState } from '../reducers/crypto-info.reducer';

// Create a feature selector for the crypto info state
export const selectCryptoInfoState = createFeatureSelector<fromCryptoInfo.CryptoInfoState>(
    fromCryptoInfo.cryptoInfoFeatureKey
);

// Create a selector to retrieve the crypto list data from the state
export const selectCryptoList = createSelector(
  selectCryptoInfoState,
  (state: fromCryptoInfo.CryptoInfoState) => state.cryptoList
);
