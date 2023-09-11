import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaign } from '@app/models/campaign.model';
import { Participation } from '@app/models/participation.model';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
import { forkJoin, Observable, of, Subject } from 'rxjs';

import {
  catchError,
  concatMap,
  map,
  mapTo,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { take as takeMath } from '@helpers/utils/math';
import { ConvertFromWei } from '@shared/pipes/wei-to-sa-tt.pipe';
import {
  BlockchainActionsService,
  ITransactionStatus
} from '@core/services/blockchain-actions.service';

import { GazConsumedByCampaign } from '@app/config/atn.config';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
interface IEarningsInSaTT {
  likesInSaTT?: string;
  viewsInSaTT?: string;
  sharesInSaTT?: string;
  reward?: string;
}

@Component({
  selector: 'app-recover-gains',
  templateUrl: './recover-gains.component.html',
  styleUrls: ['./recover-gains.component.scss']
})
export class RecoverGainsComponent implements OnInit {
  isDestroyedSubject = new Subject();
  campaignId = this.route.snapshot.queryParamMap.get('id');
  eRC20Gaz: any;
  bEPGaz: any;
  bnb: any;
  polygonGaz: any;
  eth: any;
  gazsend: any;
  queryParams$ = this.route.queryParams;
  currencyName: any;

  promData$: Observable<Participation> = this.queryParams$.pipe(
    takeUntil(this.isDestroyedSubject),
    map((params) => params['prom_hash']),
    concatMap((promHash: any) =>
      this.campaignsService.getPromById(promHash).pipe(
        map((res: any) => {
          this.currencyName = res?.data?.currency;
          return new Participation(res?.data);
        })
      )
    ),
    concatMap((prom: Participation) => {
      return this.walletFacade.getCryptoPriceList().pipe(
        tap(() => {
          if (
            this.currencyName === 'SATTBEP20' ||
            this.currencyName === 'SATTPOLYGON' ||
            this.currencyName === 'SATTBTT'
          ) {
            this.currencyName = 'SATT';
          }
        }),
        map((response: any) => response.data),
        map((data: any) => data[this.currencyName]),
        tap((sattCrypto) => {
          let fixed = this.currencyName === 'BTT' ? 10 : 9;

          prom.totalToEarnInUSD = takeMath(
            this.formWeiToPipe.transform(
              prom.totalToEarn,
              this.currencyName.toString()
            )
          )
            .times(sattCrypto.price)
            .toFixed(fixed);
        }),
        mapTo(prom)
      );
    })

    //share()
  );

  oracleImageSrc = '';


  postLink$ = this.promData$.pipe(
    takeUntil(this.isDestroyedSubject),
    map((prom: Participation) => {
    
      
      const mapping: { [key: string]: { imageSrc: string, link: string } } = {
        youtube: {
          imageSrc: '/assets/Images/youtube.svg',
          link: `https://www.youtube.com/watch?v=${prom.postId}`
        },
        facebook: {
          imageSrc: '/assets/Images/campagne/facebook_gain.svg',
          link: `https://www.facebook.com/${prom.username}/posts/${prom.postId}`
        },
        twitter: {
          imageSrc: '/assets/Images/campagne/twitter_gain.svg',
          link: `https://www.twitter.com/${prom.username}/status/${prom.postId}`
        },
        instagram: {
          imageSrc: '/assets/Images/campagne/insta_gain.svg',
          link: `https://www.instagram.com/p/${prom.postId}`
        },
        tiktok: {
          imageSrc: '/assets/Images/campagne/tiktok_gain.svg',
          link: `https://www.tiktok.com/embed/${prom.postId}`
        },
        threads: {
          imageSrc: '/assets/Images/threads-icon.svg',
          link: `https://www.threads.net/@${prom.instagramUserName}/post/${prom.postId}`
        },
        linkedin :{
          imageSrc: '/assets/Images/campagne/linkedin_gain.svg',
          link: `https://www.linkedin.com/feed/update/urn:li:share:${prom.postId}`
      
        }
      };
  
      const { imageSrc, link } = mapping[prom.oracle] || { imageSrc: '', link: '' };
      this.oracleImageSrc = imageSrc;
      return link;
    })
  );

  videoDescription$: Observable<any> = this.promData$.pipe(
    takeUntil(this.isDestroyedSubject),
    switchMap((prom) =>
      this.campaignsService.videoDescription(prom.postId, prom.oracle).pipe(
        catchError(() => {
          return of({});
        })
      )
    )
  );
  // this.campaignsStoreService.campaign$;
  campaignData$: Observable<Campaign> = this.route.queryParams.pipe(
    switchMap((params) => {
      return this.campaignsService.getOneById(params['id']);
    }),
    map((data: any) => {
      this.currencyName = data.data.token.name;
      if (this.currencyName === 'SATTBEP20') {
        this.currencyName = 'SATT';
      }
      return new Campaign(data.data);
    })
  );

  totalEarnedInSaTT$: Observable<IEarningsInSaTT> = this.promData$.pipe(
    takeUntil(this.isDestroyedSubject),
    switchMap((prom) =>
      this.campaignData$.pipe(
        map((campaign) => {
          if (campaign.remuneration === 'performance') {
            return campaign.ratios
              .filter((r) => r.oracle === prom.oracle)
              .map((r) => {
                return {
                  likesInSaTT: takeMath(r.like).times(prom.likes).toString(),
                  viewsInSaTT: takeMath(r.view).times(prom.views).toString(),
                  sharesInSaTT: takeMath(r.share).times(prom.shares).toString()
                };
              })[0] as IEarningsInSaTT;
          }
          // TODO: figure out how to calculate earning when remuneration by publication is enabled
          // if (campaign.remuneration === "publication") {
          //   return campaign.bounties
          //   .filter((b) => b.oracle === prom.oracle)
          //   .map((b) => {
          //     return {
          //       reward: b.categories.map((category: any) =>
          //         take(category.reward).times(
          //           prom.likes + prom.views + prom.shares
          //         ).toString()
          //       ),
          //     };
          //   });
          // }

          return {} as IEarningsInSaTT;
        })
      )
    )
  );

  // totalEarnedInUSD$ = this.promData$.pipe(
  //   takeUntil(this.isDestroyedSubject),
  //   switchMap((participation) =>
  //     this.cryptoDataService.fetchCryptoData().pipe(
  //       map((data: any) => data[this.currencyName]),
  //       map((sattCrypto) =>
  //         take(this.formWeiToPipe.transform(participation.totalToEarn, this.currencyName))
  //           .times(sattCrypto.price)
  //           .toFixed(3)
  //       )
  //     )
  //   )
  // );

  trnxStatus$ = this.service.trnxStatus$;
  matic: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private campaignsService: CampaignHttpApiService,
    private cryptoDataService: CryptofetchServiceService,
    private formWeiToPipe: ConvertFromWei,
    private service: BlockchainActionsService,
    private walletFacade: WalletFacadeService
  ) {}

  ngOnInit(): void {
    // this.getPriceGas();
    this.trnxStatus$
      .pipe(takeUntil(this.isDestroyedSubject))
      .subscribe((e: ITransactionStatus) => {
        if (e.status === 'succeeded' || e.status === 'failed') {
          this.router.navigate(['/home/transactions'], {
            queryParams: { status: e.status, id: this.campaignId }
          });
        }
      });
    this.parentFunction().subscribe();
  }

  ngOnDestroy(): void {
    this.isDestroyedSubject.next('');
    this.isDestroyedSubject.complete();
  }

  goToCampaign() {
    //  this.router.navigate([".."]);
    this.router.navigate(['/home/campaign', this.campaignId], {
      queryParams: { page: 'campaign' }
    });
  }
  back() {
    //  this.location.back();
    // this.router.navigate(['/home/campaign/' + this.campaignId]);
    this.router.navigate(['/home/farm-posts']);
  }

  parentFunction() {
    return this.walletFacade.getCryptoPriceList().pipe(
      map((response: any) => response.data),
      take(1),
      map((data: any) => {
        this.bnb = data['BNB'].price;
        this.eth = data['ETH'].price;
        this.matic = data['MATIC'].price;
        return {
          bnb: this.bnb,
          Eth: this.eth,
          matic: this.matic
        };
      }),
      switchMap(({ bnb, Eth, matic }) => {
        return forkJoin([
          this.walletFacade.getEtherGaz().pipe(
            tap((gaz: any) => {
              let price;
              price = gaz.data.gasPrice;
              this.gazsend = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                Eth
              ).toFixed(2);
              this.eRC20Gaz = this.gazsend;
            })
          ),
          this.walletFacade.getBnbGaz().pipe(
            tap((gaz: any) => {
              let price = gaz.data.gasPrice;
              this.bEPGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                bnb
              ).toFixed(2);

              if (this.gazsend === 'NaN') {
                this.gazsend = '';
                // this.showSpinner=true;
                let price = gaz.data.gasPrice;
                this.bEPGaz = (
                  ((price * GazConsumedByCampaign) / 1000000000) *
                  this.bnb
                ).toFixed(2);
              }
            })
          ),
          this.walletFacade.getPolygonGaz().pipe(
            tap((gaz: any) => {
              let price;
              price = gaz.data.gasPrice;

              this.polygonGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                matic
              ).toFixed(8);
            })
          )
        ]);
      })
    );
  }
}
