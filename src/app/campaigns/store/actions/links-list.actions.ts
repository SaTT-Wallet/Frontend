import { createAction, props } from '@ngrx/store';

export const loadLinksLists = createAction(
  '[LinksList] Load LinksLists',
  props<{
    pageNumber: any;
    pageSize: any;
    filterOptions: any;
    campaignId: any;
    state: any;
    firstLoad: boolean;
  }>()
);

export const loadLinksListsSuccess = createAction(
  '[LinksList] Load LinksLists Success',
  props<{ data: any }>()
);

export const loadLinksListsFailure = createAction(
  '[LinksList] Load LinksLists Failure',
  props<{ error: any }>()
);

export const clearLinksListStore = createAction(
  '[LinksList] Clear Store',
  props<{ data?: any }>()
);
