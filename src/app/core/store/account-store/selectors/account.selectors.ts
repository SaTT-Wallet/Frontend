import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAccountReducers from '../reducers/account.reducer';

export const selectAccountFeatureKey =
  createFeatureSelector<fromAccountReducers.AccountState>(
    fromAccountReducers.accountFeatureKey
  );

export const selectAccount = createSelector(
  selectAccountFeatureKey,
  (state: fromAccountReducers.AccountState) => (!!state ? state.account : null)
);
