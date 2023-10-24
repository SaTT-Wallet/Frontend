import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  debounceTime,
  filter,
  map,
  mergeMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { Page } from '@app/models/page.model';
import { Campaign } from '@app/models/campaign.model';
import _ from 'lodash';
import { CampaignsListStoreService } from '@campaigns/services/campaigns-list-store.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';

import { Subject } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import Big from 'big.js';
import { ConvertFromWei } from '@app/shared/pipes/wei-to-sa-tt.pipe';
import { CryptofetchServiceService } from '@app/core/services/wallet/cryptofetch-service.service';
import axios from 'axios';
import { environment as env } from '../../../../environments/environment';
import { ShowNumbersRule } from '@app/shared/pipes/showNumbersRule';
import { HttpClient } from '@angular/common/http';
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
  nbrWallet: any;
  nbr_tx_mainnet: any;
  nbrTransactions: any;
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
  cryptoPrices: any;
  blogs: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private campaignsListStoreService: CampaignsListStoreService,
    private tokenStorageService: TokenStorageService,
    private campaignsHttpService: CampaignHttpApiService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    private walletFacade: WalletFacadeService,
    private convertFromWeiTo: ConvertFromWei,
    private cryptoFetchService: CryptofetchServiceService,
    private showNumbersRule: ShowNumbersRule
  ) {}

  ngOnInit(): void {
    if (window.innerWidth <= 768 && isPlatformBrowser(this.platformId)) {
      this.smDevice = true;
    }
    this.getBlogs();

    if (isPlatformBrowser(this.platformId)) {
      this.loadCampaigns();
      this.loadStatistics();
      this.loadNbrWallets();
      this.loadNbrTransactions();
    }
    /*if (this.tokenStorageService.getToken()) {
      this.walletFacade.checkUserWalletV2()
      .subscribe((res: any) => {
        if(res.message === "success") {
          this.isConnected = true;
        } else this.isConnected = false;
      }, (err:any) => this.isConnected = false)
    } else {
      this.isConnected = false;
    }*/
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 768 && isPlatformBrowser(this.platformId)) {
      this.smDevice = true;
    } else {
      this.smDevice = false;
    }
  }

  getBlogs() {
    this.http.get<unknown[]>('/getBlogs').subscribe((data) => {
      this.blogs = data;
      // Now this.blogs should contain an array of blog post objects.
    });
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
      
    this.walletFacade
      .getCryptoPriceList()
      .pipe(
        filter((res) => {
          return res !== null;
        }),
        map((res: any) => res.data),
        tap((cryptoPrices) => (this.cryptoPrices = cryptoPrices)),
        mergeMap(() => {
          return this.campaignsListStoreService.list$.pipe(
            map((pages: Page<Campaign>[]) =>
              _.flatten(pages.map((page: Page<Campaign>) => page.items))
            )
          );
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe(
        (campaigns: Campaign[]) => {
          this.isLoading = false;
          this.campaignsList = campaigns.filter(campaign => campaign.type !=='draft');
          this.campaignsList?.forEach((element: Campaign) => {
            if (element.currency.name === 'SATTPOLYGON')
              element.currency.name = 'MATIC';
            if (element.currency.name === 'SATTBEP20')
              element.currency.name = 'SATT';
            if (this.cryptoPrices) {
              element.budgetUsd = new Big(
                this.cryptoPrices[element.currency.name].price + ''
              )
                .times(
                  this.convertFromWeiTo.transform(
                    element.budget,
                    element.currency.name,
                    2
                  )
                )
                .toFixed(2);
            }
          });

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

          this.campaignsList.length < 3 &&
            this.campaignsListStoreService.emitPageScroll();
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
        if (res.message === 'success' && res.code === 200) {
          this.marketCap = this.showNumbersRule.transform(
            res.data.marketCap.toFixed(2) + '',
            true
          );
          this.nbPools = this.showNumbersRule.transform(
            res.data.nbPools + '',
            true
          );
          this.posts = this.showNumbersRule.transform(
            res.data.posts + '',
            true
          );
          this.reach = this.showNumbersRule.transform(
            res.data.reach + '',
            true
          );
          this.sattPrice = parseFloat(
            this.showNumbersRule.transform(
              res.data.sattPrice.toFixed(5) + '',
              true
            )
          ).toFixed(5);
          this.views = this.showNumbersRule.transform(
            res.data.views + '',
            true
          );
          // this.harvested = this.showNumbersRule.transform(res.data.harvested + '', true);
          this.harvested = res.data.harvested;

          this.tvl = !!res.data.tvl ? res.data.tvl : 0;
          this.percentChange = !!res.data.percentChange
            ? res.data.percentChange >= 0
              ? '+' + res.data.percentChange.toFixed(2)
              : res.data.percentChange.toFixed(2)
            : 0;
        }
      });
  }

  loadNbrWallets() {
    this.campaignsHttpService
      .getWalletsCount()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((res: any) => {
        if (res.message === 'success' && res.code === 200) {
          this.nbrWallet = this.showNumbersRule.transform(res.data + '', true);
        }
        // console.log('this.nbrWallets: ', this.nbrWallet)
      });
  }

  // this.nbr_tx_mainnet = Number(loadNbrTransactions_bsc_mainnet())

  async loadNbrTransactions() {
    var sum;
    let x = axios.post(env.url_subgraph_bsc, {
      query: `
      {
        counts(id:"tx") {
          id
         count
        }
       }
      `
    });
    // .then((response) => {
    //   nb_tx_bsc_mainnet = response.data.data.counts.count
    //   console.log("nb_tx_bsc_mainnet: ", nb_tx_bsc_mainnet);
    // });

    let y = axios.post(env.url_subgraph_ether, {
      query: `
      {
        counts(id:"tx") {
          id
         count
        }
       }
      `
    });

    var [nb_tx_bsc_mainnet, nb_tx_ether_mainnet] = await Promise.all([x, y]);

    // console.log(nb_tx_bsc_mainnet.data.data.counts.count, nb_tx_ether_mainnet.data.data.counts.count)
    sum =
      +nb_tx_bsc_mainnet.data.data.counts.count +
      +nb_tx_ether_mainnet.data.data.counts.count;
    this.nbr_tx_mainnet = this.showNumbersRule.transform(sum + '', true);

    return this.nbr_tx_mainnet;

    // .then((response) => {
    //   nb_tx_ether_mainnet = response.data.data.counts.count
    //   console.log("nb_tx_ether_mainnet: ", nb_tx_ether_mainnet);
    // });
    // nb_tx = nb_tx_bsc_mainnet
    // console.log("nb_tx: ", nb_tx)

    // this.campaignsHttpService
    //   .getTransactionsCount()
    //   .pipe(takeUntil(this.isDestroyed))
    //   .subscribe((res: any) => {
    //     // if (res.message === 'success' && res.code === 200) {
    //     //   this.nbrWallet = res.data
    //     //   console.log("object")
    //     // }
    //     console.log('this.nbrTransactions: ', res)
    //   });
    // this.apollo.watchQuery({
    //   query: NB_OF_TRANSACTIONS
    // })
    // .valueChanges.subscribe((result: any) => {
    //   console.log('result**: ', result)
    // })
    // // .valueChanges.pipe(map(result => console.log('result**: ', result)))
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
