import { NgModule } from '@angular/core';

import { CampaignDetailsRoutingModule } from './campaign-details-routing.module';
import { CampaignDetailComponent } from './components/campaign-detail/campaign-detail.component';
import { CampaignInfoComponent } from './components/campaign-info/campaign-info.component';
import { CampaignDetailGainsComponent } from './components/campaign-detail-gains/campaign-detail-gains.component';
import { CampaignsSharedUiModule } from '../campaigns-shared-ui.module';
import { CampaignDetailsContainerComponent } from './components/campaign-details-container/campaign-details-container.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromCampaigns from './state/campaign-details.reducer';
import { CampaignsEffects } from './state/campaign-details.effects';

@NgModule({
  declarations: [
    CampaignDetailsContainerComponent,
    CampaignDetailComponent,
    CampaignInfoComponent,
    CampaignDetailGainsComponent
  ],
  imports: [
    CampaignsSharedUiModule,
    CampaignDetailsRoutingModule,
    StoreModule.forFeature(
      fromCampaigns.campaignDetailsFeatureKey,
      fromCampaigns.reducer
    ),
    EffectsModule.forFeature([CampaignsEffects])
  ]
})
export class CampaignDetailsModule {}
