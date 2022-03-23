import { Action, createReducer, on } from '@ngrx/store';
import * as earningsLinksListActions from '../actions/earnings-links-list.actions';
import { Participation } from '@app/models/participation.model';

export const earningsLinksListFeatureKey = 'EarningsLinksList';

export interface EarningsLinksListState {
  linksList: any;
  count: any;
  isLoaded: boolean;
  error: string;
}

export const initialEarningsLinksListState: EarningsLinksListState = {
  linksList: [],
  count: 0,
  isLoaded: false,
  error: ''
};

export const reducer = createReducer(
  initialEarningsLinksListState,
  on(
    earningsLinksListActions.loadEarningsLinksListsSuccess,
    (state, { data }) => {
      return {
        ...state,
        linksList: [
          ...state.linksList,
          ...data.Links.map((c: any) => new Participation(c))
        ],
        count: data.count,
        isLoaded: true,
        error: ''
      };
    }
  ),
  on(
    earningsLinksListActions.loadEarningsLinksListsFailure,
    (state, { error }) => ({
      ...state,
      linksList: [],
      count: 0,
      isLoaded: false,
      error: error
    })
  ),
  on(
    earningsLinksListActions.clearEarningsLinksListStore,
    (state, { data }) => ({
      ...initialEarningsLinksListState
    })
  )
);
