import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromEarningsListLinks from '@campaigns/store/reducers/earnings-links-list.reducer';

export const selectLinksListFeatureKey =
  createFeatureSelector<fromEarningsListLinks.EarningsLinksListState>(
    fromEarningsListLinks.earningsLinksListFeatureKey
  );

export const selectLinksList = createSelector(
  selectLinksListFeatureKey,
  (state: fromEarningsListLinks.EarningsLinksListState) => state.linksList
);

export const selectCountList = createSelector(
  selectLinksListFeatureKey,
  (state: fromEarningsListLinks.EarningsLinksListState) => state.count
);
