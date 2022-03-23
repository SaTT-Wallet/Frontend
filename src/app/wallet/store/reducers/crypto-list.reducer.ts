import { cryptoList } from '@app/config/atn.config';
import { Action, createReducer, on } from '@ngrx/store';
import * as cryptoListActions from '@wallet/store/actions/crypto-list.actions';

export const cryptoListFeatureKey = 'cryptoList';

export interface CryptoListState {
  cryptoList: any[];
  isLoaded: boolean;
  error: string;
}

export const initialState: CryptoListState = {
  cryptoList: [],
  isLoaded: false,
  error: ''
};

export const reducer = createReducer(
  initialState,
  on(cryptoListActions.loadCryptoListsSuccess, (state, { data }) => {
    return {
      ...state,
      cryptoList: data,
      isLoaded: true,
      error: ''
    };
  }),
  on(cryptoListActions.loadCryptoListsFailure, (state, { error }) => ({
    ...state,
    cryptoList: [],
    isLoaded: false,
    error: error
  })),
  on(cryptoListActions.clearCryptoListsState, (state) => ({
    ...initialState
  }))
);
