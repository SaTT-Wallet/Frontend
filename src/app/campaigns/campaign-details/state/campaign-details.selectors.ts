import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCampaigns from './campaign-details.reducer';

export const selectCampaignDetailsState =
  createFeatureSelector<fromCampaigns.CampaignDetailsState>(
    fromCampaigns.campaignDetailsFeatureKey
  );

export const selectCampaignDetails = createSelector(
  selectCampaignDetailsState,
  (state: fromCampaigns.CampaignDetailsState) => state.campaign.data
);

export const selectCampaignKits = createSelector(
  selectCampaignDetailsState,
  (state: fromCampaigns.CampaignDetailsState) => {
    return state.kits.data;
  }
);
