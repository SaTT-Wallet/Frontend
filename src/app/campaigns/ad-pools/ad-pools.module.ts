import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CampaignsListItemComponent } from '@app/campaigns/components/campaigns-list-item/campaigns-list-item.component';
import { AdPoolsComponent } from '@app/campaigns/ad-pools/ad-pools.component';
import { AdPoolRoutingModule } from '@app/campaigns/ad-pools/ad-pool-routing.module';
import { CampaignsSharedUiModule } from '@app/campaigns/campaigns-shared-ui.module';

@NgModule({
  declarations: [AdPoolsComponent],
  imports: [AdPoolRoutingModule, SharedModule, CampaignsSharedUiModule]
})
export class AdPoolsModule {}
