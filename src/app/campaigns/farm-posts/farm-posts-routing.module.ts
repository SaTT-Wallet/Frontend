import { RouterModule, Routes } from '@angular/router';
import { WalletComponent } from '@wallet/wallet.component';
import { AuthGuardService } from '@core/services/auth-guard.service';
import { NgModule } from '@angular/core';
import { FarmPostsComponent } from '@app/campaigns/farm-posts/farm-posts.component';
import { NoPostsToFarmComponent } from '@campaigns/components/no-posts-to-farm/no-posts-to-farm.component';

const routes: Routes = [
  {
    path: '',
    component: FarmPostsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'no-posts-to-farm',
    component: NoPostsToFarmComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FarmPostsRoutingModule {}
