import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromProfilePic from '@user-settings/store/reducers/profile-pic.reducer';

export const selectProfilePicFeatureKey =
  createFeatureSelector<fromProfilePic.ProfilePicState>(
    fromProfilePic.profilePicFeatureKey
  );

export const selectProfilePic = createSelector(
  selectProfilePicFeatureKey,
  (state: fromProfilePic.ProfilePicState) => state.profilePic
);
