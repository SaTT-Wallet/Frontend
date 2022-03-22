import { Campaign } from '@app/models/campaign.model';
import { createAction, props } from '@ngrx/store';

export const loadCampaignDetails = createAction(
  '[Campaigns] Load Campaign Details',
  props<{ id: string }>()
);

export const campaignDetailsLoadSuccess = createAction(
  '[Campaigns] Load Campaign Details Success',
  props<{ campaign: Campaign }>()
);

export const campaignDetailsLoadError = createAction(
  '[Campaigns] Load Campaign Details Error',
  props<{ error: any }>()
);

export const loadCampaignKits = createAction(
  '[Campaigns] Load Campaign Kits',
  props<{ campaignId: string }>()
);

export const loadCampaignKitsSuccess = createAction(
  '[Campaigns] Load Campaign Kits Success',
  props<{ kits: any[] }>()
);

export const loadCampaignKitsError = createAction(
  '[Campaigns] Load Campaign Kits Error',
  props<{ error: any }>()
);
