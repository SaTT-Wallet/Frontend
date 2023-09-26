import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@app/core/services/auth-guard.service';
import { RecoverGainsComponent } from '../components/recover-gains/recover-gains.component';
import { VerifyLinkComponent } from '../components/verify-link/verify-link.component';
import { CampaignDetailComponent } from './components/campaign-detail/campaign-detail.component';
import { CampaignDetailsContainerComponent } from './components/campaign-details-container/campaign-details-container.component';
import { PublicPagesGuard } from '@core/services/public-pages.guard';

const routes: Routes = [
  /*{
    path: '',
    component: CampaignDetailsContainerComponent,
    children: [
      {
        path: '',
        component: CampaignDetailComponent
      },
      {
        path: 'verify-link',
        component: VerifyLinkComponent
      },
      {
        path: 'recover-my-gains',
        component: RecoverGainsComponent
      }
    ]
  }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignDetailsRoutingModule {}
