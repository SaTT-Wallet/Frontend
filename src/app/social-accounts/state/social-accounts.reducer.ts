import { ESocialMediaNames } from '@app/core/enums';
import { createReducer, on } from '@ngrx/store';
import * as SocialAccountsActions from './social-accounts.actions';

export const visitedPagesFeatureKey = 'visitedPages';

export interface VisitedPagesState {
  visitedLinkAccountsPages: ESocialMediaNames[];
}

export const initialState: VisitedPagesState = {
  visitedLinkAccountsPages: []
};

export const reducer = createReducer(
  initialState,
  on(
    SocialAccountsActions.pageVisitedSuccess,
    (state: VisitedPagesState, action): VisitedPagesState => ({
      ...state,
      visitedLinkAccountsPages: [
        ...state.visitedLinkAccountsPages,
        action.pageVisited
      ]
    })
  )
);
