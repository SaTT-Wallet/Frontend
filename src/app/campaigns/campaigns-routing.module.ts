import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuardService } from '@core/services/auth-guard.service';
import { CampaignDetailComponent } from '@app/campaigns/campaign-details/components/campaign-detail/campaign-detail.component';
import { VerifyLinkComponent } from '@app/campaigns/components/verify-link/verify-link.component';
import { RecoverGainsComponent } from '@app/campaigns/components/recover-gains/recover-gains.component';
import { CampaignStatsComponent } from '@app/campaigns/components/campaign-stats/campaign-stats.component';
import { EditCampaignComponent } from '@app/campaigns/components/edit-campaign/edit-campaign.component';
import { CampaignsDashboardComponent } from '@app/campaigns/components/campaigns-dashboard/campaigns-dashboard.component';
import { AdPoolsComponent } from '@app/campaigns/ad-pools/ad-pools.component';
import { FarmPostsComponent } from '@app/campaigns/farm-posts/farm-posts.component';
import { CampaignDetailsContainerComponent } from '@app/campaigns/campaign-details/components/campaign-details-container/campaign-details-container.component';
import { ParticiperComponent } from '@app/campaigns/components/participer/participer.component';
import { FarmWelcomeComponent } from './components/farm-welcome/farm-welcome.component';
import { TransactionMessageStatusComponent } from '@app/campaigns/components/transaction-message-status/transaction-message-status.component';
import { PublicPagesGuard } from '@core/services/public-pages.guard';
import { CanLoadPublicModule } from '@core/services/public-pages-module.guard';
import { WelcomePageGuardService } from '@core/services/welcome-page-guard.service';

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
    path: 'campaign/:id',
    loadChildren: () =>
      import('./campaign-details/campaign-details.module').then(
        (m) => m.CampaignDetailsModule
      ),
    canLoad: [CanLoadPublicModule]
  },
  {
    path: 'welcome',
    component: FarmWelcomeComponent,
    canActivate: [WelcomePageGuardService]
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
    canActivate: [PublicPagesGuard]
  },
  {
    path: 'transactions',
    component: TransactionMessageStatusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignsRoutingModule {}
