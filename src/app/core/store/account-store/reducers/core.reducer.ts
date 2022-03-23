import { Action, combineReducers, createReducer, on } from '@ngrx/store';
import * as fromAccountReducers from '@core/store/account-store/reducers/account.reducer';
import * as fromProfilePic from '@user-settings/store/reducers/profile-pic.reducer';

export const coreFeatureKey = 'core';
export const initialState = {};
export const reducers = combineReducers({
  featureA: fromAccountReducers.reducer,
  featureB: fromProfilePic.reducer
});
