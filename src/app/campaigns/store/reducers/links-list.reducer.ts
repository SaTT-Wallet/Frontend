import { Action, createReducer, on } from '@ngrx/store';
import * as linksListActions from '../actions/links-list.actions';
import { Participation } from '@app/models/participation.model';
import { compare } from '@helpers/utils/math';
import { Big } from 'big.js';
import { youtubeThumbnail } from '@config/atn.config';

export const linksListFeatureKey = 'linksList';

export interface LinksListState {
  linksList: any;
  count: any;
  isLoaded: boolean;
  error: string;
}

export const initialLinksListState: LinksListState = {
  linksList: [],
  count: 0,
  isLoaded: false,
  error: ''
};

export const reducer = createReducer(
  initialLinksListState,
  on(linksListActions.loadLinksListsSuccess, (state, { data }) => {
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
  }),
  on(linksListActions.loadLinksListsFailure, (state, { error }) => ({
    ...state,
    linksList: [],
    count: 0,
    isLoaded: false,
    error: error
  })),
  on(linksListActions.clearLinksListStore, (state, { data }) => ({
    ...initialLinksListState
  }))
);
