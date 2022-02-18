import { User } from '@app/models/User';
import { Action, createReducer, on } from '@ngrx/store';
import { stat } from 'fs';
import * as AccountActionsUnion from '../actions/account.actions';
export const accountFeatureKey = 'account';

export interface AccountState {
  account: User | null;
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
  on(
    AccountActionsUnion.loadAccountSuccess,
    (state, payload): AccountState => ({
      ...state,
      account: { ...payload.data } as User,
      loading: true,
      error: ''
    })
  ),
  on(
    AccountActionsUnion.loadAccountFailure,
    (state, error): AccountState => ({
      ...state,
      account: null,
      loading: false,
      error: error.error
    })
  ),
  on(AccountActionsUnion.loadAccountLogout, (): AccountState => {
    return initialAccountState;
  })
);
