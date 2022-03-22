import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  visitedPagesFeatureKey,
  VisitedPagesState
} from './social-accounts.reducer';

export const selectSocialAccountsState =
  createFeatureSelector<VisitedPagesState>(visitedPagesFeatureKey);

export const selectVisitedPages = createSelector(
  selectSocialAccountsState,
  (state: VisitedPagesState) => state.visitedLinkAccountsPages
);
