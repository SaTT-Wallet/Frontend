import { createAction, props } from '@ngrx/store';

export const loadEarningsLinksLists = createAction(
  '[EarningsLinksList] Load EarningsLinksLists',
  props<{
    pageNumber: any;
    pageSize: any;
    filterOptions: any;
    campaignId: any;
    state: any;
    firstLoad: boolean;
  }>()
);

export const loadEarningsLinksListsSuccess = createAction(
  '[EarningsLinksList] Load EarningsLinksLists Success',
  props<{ data: any }>()
);

export const loadEarningsLinksListsFailure = createAction(
  '[EarningsLinksList] Load EarningsLinksLists Failure',
  props<{ error: any }>()
);

export const clearEarningsLinksListStore = createAction(
  '[EarningsLinksList] Clear Store',
  props<{ data?: any }>()
);
