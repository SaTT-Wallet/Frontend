import { ESocialMediaNames } from '@app/core/enums';
import { createAction, props } from '@ngrx/store';

export interface StoreError {
  code: EStoreErrorCodes;
  message: string;
}

export enum EStoreErrorCodes {
  HTTP_API_ERROR = 1,
  SAVE_TO_LOCALSTORAGE_ERROR
}

export const pageVisited = createAction(
  '[SocialAccounts] Page Visited',
  props<{ pageVisited: ESocialMediaNames }>()
);

export const pageVisitedSuccess = createAction(
  '[SocialAccounts] Page Visited Success',
  props<{ pageVisited: ESocialMediaNames }>()
);

export const pageVisitedFailure = createAction(
  '[SocialAccounts] Page Visited Success',
  props<{ error: StoreError }>()
);
