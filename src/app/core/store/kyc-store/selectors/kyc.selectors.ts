import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromKycReducers from '../reducers/kyc.reducer';

export const selectKYCFeatureKey =
  createFeatureSelector<fromKycReducers.KycState>(
    fromKycReducers.kycFeatureKey
  );

export const selectKyc = createSelector(
  selectKYCFeatureKey,
  (state: fromKycReducers.KycState) => (!!state ? state.legal : null)
);
