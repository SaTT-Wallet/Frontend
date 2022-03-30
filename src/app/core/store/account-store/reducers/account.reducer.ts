import { User } from '@app/models/User';
import { createReducer, on } from '@ngrx/store';
import * as AccountActionsUnion from '../actions/account.actions';

export const accountFeatureKey = 'account';
export interface AccountResponseError {
  error: string;
}
export interface AccountState {
  account: User | null | any;
  loading: boolean;
  error: string;
}

export const initialAccountState: AccountState = {
  account: null,
  loading: false,
  error: ''
};

export const reducer = createReducer(
  initialAccountState,
  on(AccountActionsUnion.loadAccountSuccess, (state, payload): AccountState => {
    return {
      ...state,
      account: { ...payload.data } as User,
      loading: true,
      error: ''
    };
  }),
  on(AccountActionsUnion.loadAccountFailure, (state, error): AccountState => {
    return {
      ...state,
      account: error.error === 'jwt expired' ? error : null,
      loading: false,
      error: error.error
    };
  }),
  on(
    AccountActionsUnion.loadAccountError,
    (state, error): AccountState => ({
      ...state,
      account: error,
      loading: false,
      error: error.error
    })
  ),
  on(AccountActionsUnion.loadAccountLogout, (): AccountState => {
    return initialAccountState;
  })
);
