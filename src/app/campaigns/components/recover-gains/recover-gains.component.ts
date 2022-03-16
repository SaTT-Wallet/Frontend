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
  mergeMap,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { take } from '@helpers/utils/math';
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
          this.currencyName = res.prom.currency;
          return new Participation(res.prom);
        })
      )
    ),
    concatMap((prom: Participation) => {
      return this.walletFacade.getCryptoPriceList().pipe(
        tap(() => {
          if (this.currencyName === 'SATTBEP20') {
            this.currencyName = 'SATT';
          }
        }),
        map((data: any) => data[this.currencyName]),
        tap((sattCrypto) => {
          prom.totalToEarnInUSD = take(
            this.formWeiToPipe.transform(
              prom.totalToEarn,
              this.currencyName.toString()
            )
          )
            .times(sattCrypto.price)
            .toFixed(3);
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
      if (prom.oracle === 'youtube') {
        this.oracleImageSrc = '/assets/Images/youtube.svg';
        return `https://www.youtube.com/watch?v=${prom.postId}`;
      }

      if (prom.oracle === 'facebook') {
        this.oracleImageSrc = '/assets/Images/campagne/facebook_gain.svg';
        return `https://www.facebook.com/${prom.username}/posts/${prom.postId}`;
      }

      if (prom.oracle === 'twitter') {
        this.oracleImageSrc = '/assets/Images/campagne/twitter_gain.svg';
        return `https://www.twitter.com/${prom.username}/status/${prom.postId}`;
      }

      if (prom.oracle === 'instagram') {
        this.oracleImageSrc = '/assets/Images/campagne/insta_gain.svg';
        return `https://www.instagram.com/p/${prom.postId}`;
      }

      return '';
    })
  );

  videoDescription$: Observable<any> = this.promData$.pipe(
    takeUntil(this.isDestroyedSubject),
    switchMap((prom) =>
      this.campaignsService.videoDescription(prom.postId).pipe(
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
                  likesInSaTT: take(r.like).times(prom.likes).toString(),
                  viewsInSaTT: take(r.view).times(prom.views).toString(),
                  sharesInSaTT: take(r.share).times(prom.shares).toString()
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
    this.getPriceGas();
    this.trnxStatus$
      .pipe(takeUntil(this.isDestroyedSubject))
      .subscribe((e: ITransactionStatus) => {
        if (e.status === 'succeeded' || e.status === 'failed') {
          this.router.navigate(['/home/transactions'], {
            queryParams: { status: e.status, id: this.campaignId }
          });
        }
      });
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
    this.router.navigate(['/home/campaign/' + this.campaignId]);
  }

  getPriceGas() {
    this.walletFacade
      .getCryptoPriceList()
      .pipe(
        mergeMap((data: any) => {
          this.bnb = data['BNB'].price;
          this.eth = data['ETH'].price;
          let arrayOfObs = [];
          arrayOfObs.push(this.walletFacade.etherGaz$);
          arrayOfObs.push(this.walletFacade.bnbGaz$);
          return forkJoin(arrayOfObs);
        }),
        takeUntil(this.isDestroyedSubject)
      )
      .subscribe((resArray) => {
        let priceEther;
        const gazEther = resArray[0];
        priceEther = gazEther.gasPrice;
        this.gazsend = (
          ((priceEther * GazConsumedByCampaign) / 1000000000) *
          this.eth
        ).toFixed(2);
        this.eRC20Gaz = this.gazsend;
        ////
        const gazBnb = resArray[1];
        let priceBnb = gazBnb.gasPrice;
        this.bEPGaz = (
          ((priceBnb * GazConsumedByCampaign) / 1000000000) *
          this.bnb
        ).toFixed(2);
      });
  }
}
