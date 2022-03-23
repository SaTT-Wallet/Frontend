import { createReducer, on } from '@ngrx/store';
import * as SocialAccountActionsUnion from '../actions/social-accounts.actions';

export const socialAccountsFeatureKey = 'socialAccounts';
export interface IGetSocialNetworksResponse {
  facebook: { [key: string]: string | boolean }[];
  google: { [key: string]: string | boolean }[];
  linkedin: { [key: string]: string | boolean }[];
  twitter: { [key: string]: string | boolean }[];
}
export interface socialAccountState {
  accounts: IGetSocialNetworksResponse | null;
  loading: boolean;
  error: string;
}

export const socialAccountinitialState: socialAccountState = {
  accounts: null,
  loading: false,
  error: ''
};

export const reducer = createReducer(
  socialAccountinitialState,
  on(
    SocialAccountActionsUnion.loadSocialAccountssSuccess,
    (state, payload): socialAccountState => ({
      ...state,
      accounts: { ...payload.data.data },
      loading: true,
      error: ''
    })
  ),
  on(
    SocialAccountActionsUnion.loadSocialAccountssFailure,
    (state, error): socialAccountState => ({
      ...state,
      accounts: null,
      loading: false,
      error: error.error
    })
  ),
  on(
    SocialAccountActionsUnion.loadSocialAccountssLogout,
    (): socialAccountState => {
      return socialAccountinitialState;
    }
  )
);
