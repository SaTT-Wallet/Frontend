import { createReducer, on } from '@ngrx/store';
import * as CryptoInfoActions from '../actions/crypto-info.actions';

export interface CryptoInfoState {
  cryptoList: any[];
  loading: boolean;
  error: any;
}

export const initialState: CryptoInfoState = {
  cryptoList: [],
  loading: false,
  error: null,
};

export const cryptoInfoReducer = createReducer(
  initialState,
  on(CryptoInfoActions.cryptoListLoaded, (state, { cryptoList }) => {
    console.log('cryptoListLoaded action dispatched. Updating cryptoList state.');
    return {
      ...state,
      cryptoList,
      loading: false,
    };
  }),
  on(CryptoInfoActions.loadCryptoList, (state) => {
    console.log('loadCryptoList action dispatched. Setting loading state.');
    return {
      ...state,
      loading: true,
    };
  }),
  on(CryptoInfoActions.loadCryptoListSuccess, (state, { cryptoList }) => {
    console.log('loadCryptoListSuccess action dispatched. Updating cryptoList state.');
    return {
      ...state,
      cryptoList,
      loading: false,
    };
  }),
  on(CryptoInfoActions.loadCryptoListFailure, (state, { error }) => {
    console.log('loadCryptoListFailure action dispatched. Updating error and loading state.');
    return {
      ...state,
      error,
      loading: false,
    };
  })
);

export const cryptoInfoFeatureKey = 'cryptoInfo';
