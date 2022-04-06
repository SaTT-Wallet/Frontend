import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as KycReducerUnion from '../reducers/kyc.reducer';

export const selectKYCFeatureKey =
  createFeatureSelector<KycReducerUnion.KycState>(
    KycReducerUnion.kycFeatureKey
  );

export const selectKyc = createSelector(
  selectKYCFeatureKey,
  (state: KycReducerUnion.KycState) => (!!state ? state.legal : null)
);
