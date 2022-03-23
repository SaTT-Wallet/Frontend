import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@core/services/auth-guard.service';
import { NgModule } from '@angular/core';
import { AdPoolsComponent } from '@app/campaigns/ad-pools/ad-pools.component';
import { PublicPagesGuard } from '@core/services/public-pages.guard';

const routes: Routes = [
  {
    path: '',
    component: AdPoolsComponent,
    canActivate: [PublicPagesGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdPoolRoutingModule {}
