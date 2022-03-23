import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromListLinks from '@campaigns/store/reducers/links-list.reducer';

export const selectLinksListFeatureKey =
  createFeatureSelector<fromListLinks.LinksListState>(
    fromListLinks.linksListFeatureKey
  );

export const selectLinksList = createSelector(
  selectLinksListFeatureKey,
  (state: fromListLinks.LinksListState) => state.linksList
);

export const selectCountList = createSelector(
  selectLinksListFeatureKey,
  (state: fromListLinks.LinksListState) => state.count
);
