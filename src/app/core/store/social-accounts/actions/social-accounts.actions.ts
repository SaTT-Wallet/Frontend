import { createAction, props } from '@ngrx/store';

export const loadSocialAccountss = createAction(
  '[SocialAccounts] Load SocialAccountss'
);
export const loadUpdatedSocialAccountss = createAction(
  '[SocialAccounts] Load SocialAccountss updated'
);
export const loadSocialAccountssSuccess = createAction(
  '[SocialAccounts] Load SocialAccountss Success',
  props<{ data: any }>()
);

export const loadSocialAccountssFailure = createAction(
  '[SocialAccounts] Load SocialAccountss Failure',
  props<{ error: any }>()
);
export const loadSocialAccountssLogout = createAction(
  '[SocialAccounts] Load SocialAccountss Logout'
);
