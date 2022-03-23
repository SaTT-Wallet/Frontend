import { Campaign } from '@app/models/campaign.model';
import * as fromCampaigns from './campaign-details.actions';

describe('loadCampaigns', () => {
  it('should return a loadCampaignDetails action', () => {
    expect(fromCampaigns.loadCampaignDetails({ id: '' }).type).toBe(
      '[Campaigns] Load Campaign Details'
    );

    expect(
      fromCampaigns.campaignDetailsLoadSuccess({ campaign: new Campaign() })
        .type
    ).toBe('[Campaigns] Load Campaign Details Success');

    expect(fromCampaigns.campaignDetailsLoadError({ error: '' }).type).toBe(
      '[Campaigns] Load Campaign Details Error'
    );

    expect(fromCampaigns.loadCampaignKits({ campaignId: '' }).type).toBe(
      '[Campaigns] Load Campaign Kits'
    );

    expect(fromCampaigns.loadCampaignKitsSuccess({ kits: [] }).type).toBe(
      '[Campaigns] Load Campaign Kits Success'
    );

    expect(fromCampaigns.loadCampaignKitsError({ error: '' }).type).toBe(
      '[Campaigns] Load Campaign Kits'
    );
  });
});
