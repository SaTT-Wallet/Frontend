import { CampaignDetailsState } from '../state/campaign-details.reducer';
import * as CampaignDetailsActions from '../state/campaign-details.actions';
import * as CampaignDetailsSelectors from '../state/campaign-details.selectors';
import { Injectable } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { Campaign } from '@app/models/campaign.model';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class CampaignDetailsFacade {
  campaign$ = this.store
    .select(CampaignDetailsSelectors.selectCampaignDetails)
    .pipe(filter((campaign: Campaign) => campaign.id !== ''));

  kits$ = this.store
    .select(CampaignDetailsSelectors.selectCampaignKits)
    .pipe(tap((kits) => {}));

  constructor(private store: Store<CampaignDetailsState>) {}

  loadCampaignDetails(id: string) {
    this.store.dispatch(CampaignDetailsActions.loadCampaignDetails({ id }));
  }

  loadKits(campaignId: string) {
    this.store.dispatch(
      CampaignDetailsActions.loadCampaignKits({ campaignId })
    );
  }
}
