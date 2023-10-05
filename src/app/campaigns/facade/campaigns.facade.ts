import { Injectable, Injector } from '@angular/core';
import { CampaignsFacade } from '../models/campaigns-facade.interface';
import { CampaignsListStoreService } from '../services/campaigns-list-store.service';
import { CampaignDetailsFacade } from '../campaign-details/facade/campaign-details.facade';
import { filter } from 'rxjs/operators';
import { selectLinksList } from '@campaigns/store/selectors/links-list.selectors';
import { Store } from '@ngrx/store';
import { clearLinksListStore } from '@campaigns/store/actions/links-list.actions';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignsService implements CampaignsFacade {
  private _campaignsListStoreService?: CampaignsListStoreService;
  private _campaignDetailsFacade?: CampaignDetailsFacade;
  private _campaignsHttpApiService?: CampaignHttpApiService;

  campaignsPage$ = this.campaignsListStoreService.list$;
  campaign$ = this.campaignDetailsFacade.campaign$;
  kits$ = this.campaignDetailsFacade.kits$;
  campaignsSortItem$ =
    this.campaignsListStoreService.sortCampaignsOnMobile$.pipe(
      filter((res) => res !== null)
    );

  constructor(
    private injector: Injector,
    private store: Store<CampaignsService>
  ) {}
  private get campaignsListStoreService(): CampaignsListStoreService {
    if (!this._campaignsListStoreService) {
      this._campaignsListStoreService = this.injector.get(
        CampaignsListStoreService
      );
    }
    return this._campaignsListStoreService;
  }

  private get campaignsHttpApiService(): CampaignHttpApiService {
    if (!this._campaignsHttpApiService) {
      this._campaignsHttpApiService = this.injector.get(CampaignHttpApiService);
    }
    return this._campaignsHttpApiService;
  }

  private get campaignDetailsFacade(): CampaignDetailsFacade {
    if (!this._campaignDetailsFacade) {
      this._campaignDetailsFacade = this.injector.get(CampaignDetailsFacade);
    }
    return this._campaignDetailsFacade;
  }

  public get linksList$() {
    return this.store.select(selectLinksList);
  }

  loadNextPage(filterOptions: any, firstLoad: boolean): void {
    this.campaignsListStoreService.loadNextPage(filterOptions, firstLoad);
  }

  loadCampaignDetails(id: string) {
    this.campaignDetailsFacade.loadCampaignDetails(id);
  }

  loadKits(campaignId: string) {
    this.campaignDetailsFacade.loadKits(campaignId);
  }

  loadAdPoolCampaignsSortItem(sortItem: any) {
    this.campaignsListStoreService.setAdPoolCampaignsListSort(sortItem);
  }

  clearLinksListStore() {
    this.store.dispatch(clearLinksListStore({}));
  }

  getWelcomePageStats() {
    return this.campaignsHttpApiService.getWelcomePageStats();
  }

  generateBriefIA(title: string) {
    return this.campaignsHttpApiService.generateBrief(title);
  }
}
