import { createAction, props } from '@ngrx/store';

export const loadProfilePics = createAction('[ProfilePic] Load ProfilePics');

export const loadProfilePicsSuccess = createAction(
  '[ProfilePic] Load ProfilePics Success',
  props<{ data: any }>()
);

export const loadProfilePicsFailure = createAction(
  '[ProfilePic] Load ProfilePics Failure',
  props<{ error: any }>()
);

export const clearProfilePicStore = createAction(
  '[ProfilePic] Clear ProfilePics Store'
);
