import { Action, createReducer, on } from '@ngrx/store';
import * as profilePicActions from '@user-settings/store/actions/profile-pic.actions';
import { Participation } from '@app/models/participation.model';
import { initialLinksListState } from '@campaigns/store/reducers/links-list.reducer';
import { clearProfilePicStore } from '@user-settings/store/actions/profile-pic.actions';

export const profilePicFeatureKey = 'profilePic';

export interface ProfilePicState {
  profilePic: any;
  isLoaded: boolean;
  error: string;
}

export const initialProfilePicState: ProfilePicState = {
  profilePic: null,
  isLoaded: false,
  error: ''
};

export const reducer = createReducer(
  initialProfilePicState,
  on(profilePicActions.loadProfilePicsSuccess, (state, { data }) => {
    return {
      ...state,
      profilePic: data,
      isLoaded: true,
      error: ''
    };
  }),
  on(profilePicActions.loadProfilePicsFailure, (state, { error }) => ({
    ...state,
    profilePic: null,
    isLoaded: false,
    error: error
  })),
  on(profilePicActions.clearProfilePicStore, (state) => ({
    ...initialProfilePicState
  }))
);
