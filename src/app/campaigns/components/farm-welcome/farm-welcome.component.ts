import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { Page } from '@app/models/page.model';
import { Campaign } from '@app/models/campaign.model';
import _ from 'lodash';
import { CampaignsListStoreService } from '@campaigns/services/campaigns-list-store.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';

import { Subject } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-farm-welcome',
  templateUrl: './farm-welcome.component.html',
  styleUrls: ['./farm-welcome.component.scss']
})
export class FarmWelcomeComponent implements OnInit {
  showSpinnerInfo!: boolean;
  showSpinnerJoin!: boolean;
  isLoading = true;
  campaignsList: Campaign[] = [];
  campaignsList2: Campaign[] = [];
  marketCap: any;
  nbPools: any;
  posts: any;
  reach: any;
  sattPrice: any;
  views: any;
  tvl: any;
  harvested: any;
  percentChange = 0;
  isConnected = false;
  smDevice = false;
  noData: boolean = true;
  campaignNumber: number = 0;
  private isDestroyed = new Subject();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private campaignsListStoreService: CampaignsListStoreService,
    private tokenStorageService: TokenStorageService,
    private campaignsHttpService: CampaignHttpApiService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit(): void {
    if (window.innerWidth <= 768 && isPlatformBrowser(this.platformId)) {
      this.smDevice = true;
    }
    if (isPlatformBrowser(this.platformId)) {
      this.loadCampaigns();
      this.loadStatistics();
    }
    if (this.tokenStorageService.getToken()) {
      this.isConnected = true;
    } else {
      this.isConnected = false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 768 && isPlatformBrowser(this.platformId)) {
      this.smDevice = true;
    } else {
      this.smDevice = false;
    }
  }

  goToFarmPosts() {
    this.showSpinnerJoin = true;
    this.router.navigate(['/home/ad-pools']);
  }
  trackById(index: number, campaign: any) {
    return campaign;
  }
  redirectqueryparam() {
    this.showSpinnerInfo = true;
    const queryParams: Params = { page: 'adpool' };
    this.router.navigate(['/home/FAQ'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams
    });
  }

  loadCampaigns() {
    this.campaignsListStoreService.loadingCampaign$
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((res) => {
        if (res) {
          this.isLoading = true;
        } else {
          this.isLoading = false;
        }
      });
    // TODO: load campaigns list here
    this.campaignsListStoreService.list$
      .pipe(filter((data) => data[0].size !== 0))
      .pipe(
        map((pages: Page<Campaign>[]) => {
          return _.flatten(pages.map((page: Page<Campaign>) => page.items));
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe(
        (campaigns: Campaign[]) => {
          this.isLoading = false;
          this.campaignsList = campaigns;
          this.campaignsList2 = campaigns;
          this.campaignNumber = this.campaignsListStoreService.countCampaigns;
          if (campaigns.length === 0 && this.campaignNumber === 0) {
            this.noData = true;
          } else if (campaigns.length === 0 && this.campaignNumber !== 0) {
            this.noData = true;
          } else if (campaigns.length === this.campaignNumber) {
            this.noData = true;
          } else {
            this.noData = false;
          }
          // this.campaignsList = campaigns.filter(
          //   (campaign: Campaign) => campaign.isDraft === false
          // );
        },
        () => {
          this.isLoading = false;
        }
      );

    this.campaignsListStoreService.loadNextPage({}, true);
    this.campaignsHttpService.loadDataWelcomePageWhenEndScroll
      .pipe(debounceTime(1000), takeUntil(this.isDestroyed))
      .subscribe(() => {
        this.campaignsListStoreService.emitPageScroll();
      });
  }

  loadStatistics() {
    this.campaignsHttpService
      .getWelcomePageStats()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((res: any) => {
        this.marketCap = res.result.marketCap.toFixed(2);
        this.nbPools = res.result.nbPools;
        this.posts = res.result.posts;
        this.reach = res.result.reach;
        this.sattPrice = res.result.sattPrice.toFixed(5);
        this.views = res.result.views;
        this.harvested = res.result.harvested;
        this.tvl = !!res.result.tvl ? res.result.tvl : 0;
        this.percentChange = !!res.result.percentChange
          ? res.result.percentChange >= 0
            ? '+' + res.result.percentChange.toFixed(2)
            : res.result.percentChange.toFixed(2)
          : 0;
      });
  }

  loadMore() {
    this.campaignsListStoreService.emitPageScroll();
  }

  openInNewTab(url: string) {
    if (isPlatformBrowser(this.platformId)) window.open(url, '_blank');
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
