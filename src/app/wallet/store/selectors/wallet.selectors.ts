import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromWalletReducers from '@wallet/store/reducers/wallet.reducer';

export const selectWalletFeatureKey =
  createFeatureSelector<fromWalletReducers.TotaleBalanceState>(
    fromWalletReducers.walletFeatureKey
  );

export const selectTotaleBalance = createSelector(
  selectWalletFeatureKey,
  (state: fromWalletReducers.TotaleBalanceState) => state.totalBalance
);
