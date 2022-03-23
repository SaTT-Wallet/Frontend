import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FarmPostsComponent } from '@app/campaigns/farm-posts/farm-posts.component';
import { FarmPostsRoutingModule } from '@app/campaigns/farm-posts/farm-posts-routing.module';
import { CampaignsSharedUiModule } from '@app/campaigns/campaigns-shared-ui.module';

@NgModule({
  declarations: [FarmPostsComponent],
  imports: [FarmPostsRoutingModule, SharedModule, CampaignsSharedUiModule]
})
export class FarmPostsModule {}
