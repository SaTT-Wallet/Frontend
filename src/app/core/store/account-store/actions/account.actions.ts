import { User } from '@app/models/User';
import { createAction, props } from '@ngrx/store';

export const loadAccount = createAction('[Account] Load Account');
export const loadUpdatedAccount = createAction(
  '[Account] Load updated Account'
);
export const loadAccountSuccess = createAction(
  '[Account] Load Account Success',
  props<{ data: User }>()
);

export const loadAccountFailure = createAction(
  '[Account] Load Account Failure',
  props<{ error: any }>()
);

export const loadAccountError = createAction(
  '[Account] Load Account Error',
  props<{ error: any }>()
);

export const loadAccountLogout = createAction('[Account] Load Account Logout');
// const all = union({
//   loadAccount,
//   loadAccountSuccess,
//   loadAccountFailure,
//   loadAccountLogout
// });
// export type AccountActionsUnion = typeof all;
