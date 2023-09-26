import { NgModule, ViewContainerRef, ViewRef } from '@angular/core';
import { CampaignsRoutingModule } from '@app/campaigns/campaigns-routing.module';
import { DashboardHeaderComponent } from '@app/campaigns/components/dashboard-header/dashboard-header.component';
import { MultiSelectComponent } from '@app/shared/components/multi-select/multi-select.component';
import { FlatSelectComponent } from '@app/campaigns/components/filter-campaign/filter-campaign.component';
import { VerifyLinkComponent } from '@app/campaigns/components/verify-link/verify-link.component';
import { RecoverGainsComponent } from '@app/campaigns/components/recover-gains/recover-gains.component';
import { CampaignStatsComponent } from '@app/campaigns/components/campaign-stats/campaign-stats.component';
import { EditCampaignComponent } from '@app/campaigns/components/edit-campaign/edit-campaign.component';
import { ConfirmBlockchainActionComponent } from '@app/campaigns/components/confirm-blockchain-action/confirm-blockchain-action.component';
import { DraftCampaignPresentationComponent } from '@app/campaigns/components/draft-campaign-presentation/draft-campaign-presentation.component';
import { DraftCampaignParametresComponent } from '@app/campaigns/components/draft-campaign-parametres/draft-campaign-parametres.component';
import { RemunerationComponent } from '@app/campaigns/components/remuneration/remuneration.component';
import { DraftCampaignKitComponent } from '@app/campaigns/components/draft-campaign-kit/draft-campaign-kit.component';
import { CampaignsDashboardComponent } from '@app/campaigns/components/campaigns-dashboard/campaigns-dashboard.component';
import { FarmWelcomeComponent } from './components/farm-welcome/farm-welcome.component';
import { ParticiperComponent } from '@app/campaigns/components/participer/participer.component';
import { PasswordModalComponent } from './components/password-modal/password-modal.component';
import { TransactionMessageStatusComponent } from '@app/campaigns/components/transaction-message-status/transaction-message-status.component';
import { NgxTweetModule } from 'ngx-tweet';
import { DraftMaximumParticipationComponent } from '@app/campaigns/components/draft-maximum-participation/draft-maximum-participation.component';
import { CampaignsSharedUiModule } from './campaigns-shared-ui.module';
import { NpnSliderModule } from 'npn-slider';
import { EffectsModule } from '@ngrx/effects';
import { LinksListEffects } from './store/effects/links-list.effects';
import { StoreModule } from '@ngrx/store';
import * as fromListLinks from '@campaigns/store/reducers/links-list.reducer';
import { CampaignsListItemComponent } from '@campaigns/components/campaigns-list-item/campaigns-list-item.component';
import { NoPostsToFarmComponent } from '@campaigns/components/no-posts-to-farm/no-posts-to-farm.component';
import { MissionsComponent } from './components/missions/missions.component';
import { ConvertFromWei } from '@app/shared/pipes/wei-to-sa-tt.pipe';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DraftPictureComponent } from './components/draft-picture/draft-picture.component';
import { CommonModule } from '@angular/common';
import { SocialsComponent } from './socials/socials.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    CampaignsDashboardComponent,
    DashboardHeaderComponent,
    FlatSelectComponent,
    VerifyLinkComponent,
    RecoverGainsComponent,
    CampaignStatsComponent,
    EditCampaignComponent,
    ConfirmBlockchainActionComponent,
    DraftCampaignPresentationComponent,
    DraftCampaignParametresComponent,
    RemunerationComponent,
    DraftCampaignKitComponent,
    FarmWelcomeComponent,
    NoPostsToFarmComponent,
    ParticiperComponent,
    PasswordModalComponent,
    TransactionMessageStatusComponent,
    MissionsComponent,
    DraftPictureComponent,
    SocialsComponent,
    DraftMaximumParticipationComponent
  ],
  imports: [
    CommonModule,
    CampaignsRoutingModule,
    CampaignsSharedUiModule,
    NgxTweetModule,
    EffectsModule.forFeature([LinksListEffects]),
    StoreModule.forFeature(
      fromListLinks.linksListFeatureKey,
      fromListLinks.reducer
    ),
    SharedModule
  ],
  exports: [CampaignsRoutingModule],
  providers: [ConvertFromWei]
})
export class CampaignsModule {}
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
