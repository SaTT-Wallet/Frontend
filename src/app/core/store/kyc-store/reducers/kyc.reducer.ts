import { createReducer, on } from '@ngrx/store';
import * as KycActionsUnion from '../actions/kyc.actions';

export const kycFeatureKey = 'kyc';

export interface KycState {
  legal: any;
  loading: boolean;
  error: string;
}

export const initialKycState: KycState = {
  legal: null,
  loading: false,
  error: ''
};

export const reducer = createReducer(
  initialKycState,
  on(
    KycActionsUnion.loadKycSuccess,
    (state, payload): KycState => ({
      ...state,
      legal: { ...payload.data },
      loading: true,
      error: ''
    })
  ),
  on(
    KycActionsUnion.loadKycFailure,
    (state, error): KycState => ({
      ...state,
      legal: null,
      loading: false,
      error: error.error
    })
  ),
  on(KycActionsUnion.loadKycLogout, (): KycState => {
    return initialKycState;
  })
);
