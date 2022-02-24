import { Campaign } from '@app/models/campaign.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as CampaignDetailsActions from './campaign-details.actions';

export const campaignDetailsFeatureKey = 'campaignDetails';

export interface CampaignDetailsState {
  campaign: { data: Campaign; isLoaded: boolean };
  kits: { data: any[]; isLoaded: boolean };
}

export const initialState: CampaignDetailsState = {
  campaign: { data: new Campaign(), isLoaded: false },
  kits: { data: [], isLoaded: false }
};

export const reducer = createReducer(
  initialState,
  on(
    CampaignDetailsActions.loadCampaignKits,
    (state: CampaignDetailsState, action): CampaignDetailsState => ({
      ...state,
      kits: { data: [], isLoaded: false }
    })
  ),
  on(
    CampaignDetailsActions.campaignDetailsLoadSuccess,
    (state: CampaignDetailsState, action): CampaignDetailsState => ({
      ...state,
      campaign: { data: action.campaign, isLoaded: true }
    })
  ),
  on(
    CampaignDetailsActions.loadCampaignKitsSuccess,
    (state: CampaignDetailsState, action): CampaignDetailsState => ({
      ...state,
      kits: { data: action.kits, isLoaded: true }
    })
  )
);
