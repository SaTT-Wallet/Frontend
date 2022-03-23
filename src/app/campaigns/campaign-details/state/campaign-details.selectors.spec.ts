import { Campaign } from '@app/models/campaign.model';
import * as fromCampaigns from './campaign-details.reducer';
import { selectCampaignDetailsState } from './campaign-details.selectors';

describe('Campaigns Selectors', () => {
  it('should select the feature state', () => {
    const result = selectCampaignDetailsState({
      [fromCampaigns.campaignDetailsFeatureKey]: {}
    });

    // expect(result).toEqual({ campaign: new Campaign(), isLoaded: false });
  });
});
