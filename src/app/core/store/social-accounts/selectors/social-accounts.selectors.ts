import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSocialAccountsReducers from '../reducers/social-accounts.reducer';

export const selectSocialAccountFeatureKey =
  createFeatureSelector<fromSocialAccountsReducers.socialAccountState>(
    fromSocialAccountsReducers.socialAccountsFeatureKey
  );

export const selectSocialAccount = createSelector(
  selectSocialAccountFeatureKey,
  (state: fromSocialAccountsReducers.socialAccountState) =>
    !!state ? state.accounts : null
);
