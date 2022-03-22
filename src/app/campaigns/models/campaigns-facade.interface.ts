import { Campaign } from '@app/models/campaign.model';
import { Page } from '@app/models/page.model';
import { Observable } from 'rxjs';

export interface CampaignsFacade {
  campaignsPage$?: Observable<Page<Campaign>[]>;
  loadNextPage(filterOptions: any, firstLoad: boolean): void;
}
