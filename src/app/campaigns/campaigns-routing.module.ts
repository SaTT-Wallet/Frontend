import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuardService } from '@core/services/auth-guard.service';

import { CampaignStatsComponent } from '@app/campaigns/components/campaign-stats/campaign-stats.component';
import { EditCampaignComponent } from '@app/campaigns/components/edit-campaign/edit-campaign.component';
import { CampaignsDashboardComponent } from '@app/campaigns/components/campaigns-dashboard/campaigns-dashboard.component';

import { ParticiperComponent } from '@app/campaigns/components/participer/participer.component';
import { FarmWelcomeComponent } from './components/farm-welcome/farm-welcome.component';
import { TransactionMessageStatusComponent } from '@app/campaigns/components/transaction-message-status/transaction-message-status.component';
import { CanLoadPublicModule } from '@core/services/public-pages-module.guard';
import { WelcomePageGuardService } from '@core/services/welcome-page-guard.service';
import { SocialsComponent } from './socials/socials.component';
import { CampaignDetailComponent } from './campaign-details/components/campaign-detail/campaign-detail.component';
import { RecoverGainsComponent } from './components/recover-gains/recover-gains.component';
import { VerifyLinkComponent } from './components/verify-link/verify-link.component';

const routes: Routes = [
  {
    path: '',
    //dashboard
    component: CampaignsDashboardComponent,
    children: [
      {
        path: 'ad-pools',
        loadChildren: () =>
          import('./ad-pools/ad-pools.module').then((m) => m.AdPoolsModule)
      },
      {
        path: 'farm-posts',
        loadChildren: () =>
          import('./farm-posts/farm-posts.module').then(
            (m) => m.FarmPostsModule
          )
      },
      { path: '', redirectTo: '/welcome', pathMatch: 'full' }
    ]
  },
  {
    path:'campaign/:id',
    component: CampaignDetailComponent
  },
  {
    path: 'campaign/:id/verify-link',
    component: VerifyLinkComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'campaign/:id/recover-my-gains',
    component: RecoverGainsComponent,
    canActivate: [AuthGuardService]
  },
  /*{
    path: 'campaign/:id',
    loadChildren: () =>
      import('./campaign-details/campaign-details.module').then(
        (m) => m.CampaignDetailsModule
      ),
    canLoad: [CanLoadPublicModule]
  },*/
  {
    path: 'welcome',
    component: FarmWelcomeComponent
    //canActivate: [WelcomePageGuardService]
  },
  {
    path: 'part/:campaign_id',
    component: ParticiperComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'stat-chart', component: CampaignStatsComponent },
  {
    path: 'campaign/:id/edit',
    component: EditCampaignComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'transactions',
    component: TransactionMessageStatusComponent
  },
  {
    path: 'socials',
    component: SocialsComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignsRoutingModule {}
