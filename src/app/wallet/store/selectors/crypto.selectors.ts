
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CryptoState } from '../reducers/crypto.reducer';

const selectCryptoState = createFeatureSelector<CryptoState>('crypto');

export const selectCryptoData = createSelector(
  selectCryptoState,
  (state) => state.data
);
export const selectCryptoLoading = createSelector(
  selectCryptoState,
  (state) => state.loading
);
export const selectCryptoError = createSelector(
  selectCryptoState,
  (state) => state.error
);
