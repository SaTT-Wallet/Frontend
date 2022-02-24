import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Page } from '@app/models/page.model';
import { Campaign } from '@app/models/campaign.model';
import _ from 'lodash';
import { CampaignsListStoreService } from '@campaigns/services/campaigns-list-store.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-no-posts-to-farm',
  templateUrl: './no-posts-to-farm.component.html',
  styleUrls: ['./no-posts-to-farm.component.scss']
})
export class NoPostsToFarmComponent implements OnInit {
  showSpinnerInfo!: boolean;
  showSpinnerJoin!: boolean;
  isConnected = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      this.isConnected = true;
    } else {
      this.isConnected = false;
    }
  }
  goToFarmPosts() {
    this.showSpinnerJoin = true;
    this.router.navigate(['/home/ad-pools']);
  }
  redirectqueryparam() {
    this.showSpinnerInfo = true;
    const queryParams: Params = { page: 'adpool' };
    this.router.navigate(['/home/FAQ'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams
    });
  }

  openInNewTab(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.open(url, '_blank');
    }
  }
}
