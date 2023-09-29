  import { createReducer, on } from '@ngrx/store';
  import * as CryptoActions from '../actions/crypto.actions';

  export interface CryptoState {
    cryptoPriceList: any[] | null;
    error: any | null;
  }

  export const initialState: CryptoState = {
    cryptoPriceList: null,
    error: null
  };

  export const cryptoReducerList = createReducer(
    initialState,
    on(
      CryptoActions.fetchCryptoPriceListSuccess,
      (state, { cryptoPriceList }) => {
        return {
          ...state,
          cryptoPriceList,
          error: null,
        };
      }
    ),
    on(CryptoActions.fetchCryptoPriceListFailure, (state, { error }) => ({
      ...state,
      cryptoPriceList: null,
      error
    }))
  );
