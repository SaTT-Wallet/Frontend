import { createReducer, on } from '@ngrx/store';
import * as CryptoActions from '../actions/crypto.actions';
import { CryptoData } from '@app/models/crypto-data.model';

export interface CryptoState {
  data: CryptoData[];
  loading: boolean;
  error: any;
}

const initialState: CryptoState = {
  data: [],
  loading: false,
  error: null,
};

export const cryptoReducer = createReducer(
  initialState,
  on(CryptoActions.loadCryptoData, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CryptoActions.loadCryptoDataSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false,
  })),
  on(CryptoActions.loadCryptoDataFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
