import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  Output
} from '@angular/core';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  catchError,
  filter,
  map,
  shareReplay,
  switchMap,
  tap,
  toArray,
  concatMap,
  mapTo,
  retry,
  takeUntil,
  delay
} from 'rxjs/operators';
import { from, Observable, of, Subject, Subscription } from 'rxjs';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
// import { ConvertFromWei } from ""
import { BlockchainActionsService } from '@core/services/blockchain-actions.service';
import { ListTokens, youtubeThumbnail } from '@config/atn.config';
import { TranslateService } from '@ngx-translate/core';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Campaign } from '@app/models/campaign.model';
import { compare } from '@helpers/utils/math';
import { EButtonActions } from '@app/core/enums';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import {
  atLastOneChecked,
  requiredDescription
} from '@app/helpers/form-validators';
import { ConvertFromWei } from '@app/shared/pipes/wei-to-sa-tt.pipe';
import { ConvertToWeiPipe } from '@app/shared/pipes/convert-to-wei.pipe';
import { ParticipationListStoreService } from '@campaigns/services/participation-list-store.service';
import { Participation } from '@app/models/participation.model';
import { Page } from '@app/models/page.model';
import _ from 'lodash';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import * as moment from 'moment';
import { ViewportScroller } from '@angular/common';
import { Big } from 'big.js';
@Component({
  selector: 'app-campaign-detail-gains',
  templateUrl: './campaign-detail-gains.component.html',
  styleUrls: ['./campaign-detail-gains.component.css'],
  providers: [ConvertToWeiPipe, ConvertFromWei]
})
export class CampaignDetailGainsComponent implements OnInit {
  searchData: string = '';
  sortItem = '';
  @Input() campaign = new Campaign();
  @Input() totalInvested: any;
  @Input() totalInvestedInUsD: any;
  @Input() campaignRemainingUsd: any;
  @Input() isOwnedByUser: boolean = false;
  @Input() gains: Big = new Big(0);
  @Input() gainsUSD: any;
  @Output()
  disabled!: boolean;
  @Input() isFormatGrid: boolean = true;
  isStyleGrid: boolean = true;
  // influencerProms:any= new Observable<any>();
  gainsTotal: any = '0';
  gainsTotalInUsD = new Observable<any>();
  actualProm: any;
  gainsEarned: any = '0';
  gainsEarnedInUsD = new Observable();
  gainsToEarn: any = '0';
  gainsToEarnInUsD = new Observable();
  prom: any;
  showSpinner: boolean = true;

  sumearning: any;
  sumearningUSD: any;
  publications: any;
  idProm: any;
  walletPassword: any;
  validationAttempt = false;
  influencerWallet: any = this.tokenStorageService.getIdWallet();
  influencerProms: any = new Observable<any>();
  etherInWei: any;
  isGainsDisabled = new Observable<boolean>();
  promsList: any[] = [];
  currencyName = '';
  linkHash: any;
  link: boolean = false;
  campaignLinks: Participation[] = [];
  subscription: Subscription | undefined;
  private isDestroyed = new Subject();
  showFilter: boolean = false;
  showSort: boolean = false;
  sortDownRestToClaim: boolean = true;
  sortDownEarnings: boolean = true;
  sortDownMedia: boolean = true;
  sortDownSendBy: boolean = true;
  sortDownDate: boolean = true;
  sortDownViews: boolean = true;
  sortDownLikes: boolean = true;
  sortDownShares: boolean = true;
  sortDownAbosNumber: boolean = true;
  isFirstLoad = true;
  constructor(
    public CampaignService: CampaignHttpApiService,
    private fromWeiTo: ConvertFromWei,
    private tokenStorageService: TokenStorageService,
    private _sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    public translate: TranslateService,
    private Fetchservice: CryptofetchServiceService,
    private router: Router,
    private toastr: ToastrService,
    private blockchainActions: BlockchainActionsService,
    public modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    public ParticipationListService: ParticipationListStoreService,
    private campaignService: CampaignHttpApiService,
    private walletFacade: WalletFacadeService,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    //  this.calcGains();
    this.ParticipationListService.isEarnings = true;
    this.setQuery();
    this.subscription = this.campaignService.loadDataEarningsWhenEndScroll
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(() => {
        this.ParticipationListService.emitPageScroll();
      });
    //  this.reasonForm.setErrors({'incorrect': true});
    this.currencyName = this.campaign.currency.name;
    if (this.currencyName === 'SATTBEP20') {
      this.currencyName = 'SATT';
    }
    this.etherInWei = ListTokens[this.currencyName].decimals;
    this.getCampaignList();
    //this.gettingInfluencerProms();
  }
  calcGains() {
    this.CampaignService.getAllPromsStats(this.campaign.id, this.isOwnedByUser)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((proms: any) => {
        this.checkingGains(proms.allProms);
        this.getStatEarnings(proms.allProms);
      });
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
  onScroll() {
    this.ParticipationListService.emitPageScroll();
  }
  setQuery() {
    let state = '';
    if (this.campaign.isOwnedByUser) {
      state = 'owner';
    } else {
      state = 'part';
    }
    this.ParticipationListService.setQueryParams({
      campaignId: this.campaign.hash,
      state: state
    });
  }
  createDateFromUnixTimestamp(unixTimestamp: number) {
    if (unixTimestamp) {
      var a = new Date(unixTimestamp * 1000);
      var months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time =
        date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
      return time;
    } else {
      return;
    }
  }

  getLink() {
    this.linkHash = this.activatedRoute.snapshot.queryParamMap.get('linkHash');
    if (this.linkHash) {
      let itemFound = false;
      this.promsList.map((item) => {
        itemFound = this.linkHash === item.id_prom;
        if (itemFound) {
          this.scroller.scrollToAnchor(this.linkHash);
        }
      });
      if (!itemFound) {
        this.ParticipationListService.loadNextPage({}, false, {});
      }
    }
  }

  getCampaignList() {
    this.ParticipationListService.listLinks$
      .pipe(
        takeUntil(this.isDestroyed),
        map((pages: Page<Participation>[]) =>
          _.flatten(pages.map((page: Page<Participation>) => page.items))
        ),
        delay(5000)
      )
      .subscribe((links: Participation[]) => {
        this.showSpinner = false;
        this.isFirstLoad = false;
        this.campaignLinks = links;

        //   this.checkingGains(this.campaignLinks);
        this.publications = links?.length || '0';
        this.getLink();
        this.ref.detectChanges();
      });
  }

  update(promId: string) {
    this.campaignLinks = this.campaignLinks.filter(
      (prom) => prom.id !== promId
    );
  }

  gettingInfluencerProms(): void {
    if (this.isOwnedByUser === false) {
      this.influencerProms = this.activatedRoute.params.pipe(
        tap((params) => {}),
        map((params) => params.id),
        switchMap((id) =>
          this.CampaignService.getAllPromsStats(
            id ?? this.campaign.id,
            this.isOwnedByUser
          ).pipe(
            retry(3),
            map((data: any) => data.allProms),
            switchMap((array: any) => from(array)),
            filter(
              (prom: any) =>
                prom.appliedDate &&
                prom.status !== 'rejected' &&
                prom.influencer.toLowerCase() ===
                  this.influencerWallet.toLowerCase()
            ),
            concatMap((prom: any) => {
              if (this.campaign.ratios.length) {
                return this.CampaignService.verifyGains(prom.id).pipe(
                  map((res: any) => {
                    if (prom.status === true) {
                      prom.disable = res.disabled;
                    }

                    return prom;
                  }),
                  catchError((err) => {
                    return of(prom);
                  })
                );
              }
              return of(prom);
            }),
            // concatMap((prom: any) => {
            //   return this.CampaignService.getBestInfluencerPic(
            //     prom.meta._id
            //   ).pipe(
            //     map((res: any) => {
            //       let objectURL = URL.createObjectURL(res);
            //       prom.pic = prom?.meta?.picLink
            //         ? prom?.meta?.picLink
            //         : this._sanitizer.bypassSecurityTrustUrl(objectURL);

            //       return prom;
            //     }),
            //     catchError((err) => {
            //       console.log(err);
            //       return of(prom);
            //     })
            //   );
            // }),
            //  concatMap((prom:any)=>{
            //          prom.camp=this.campaign.id
            // this.influencerProms.forEach((element:any) => {
            //   element.campaign =this.campaign;

            // });

            // return prom
            //  }),
            toArray(),
            map((array: any) => {
              if (this.campaign.ratios.length) {
                return this.sortingPromsArray(array);
              } else {
                return this.sortingPromsArrayPublication(array);
              }
            }),
            tap((array: any) => {
              // this.publications = array?.length || "0";
              this.checkingGains(array);
              //  this.getSocialLinks(array);
              // this.getLink();
              this.getStatEarnings(array);
              // this.showSpinner = false;
            }),
            shareReplay(1)
          )
        )
      );
    } else {
      this.influencerProms = this.activatedRoute.params.pipe(
        tap((params) => {
          this.showSpinner = true;
        }),
        map((params) => params.id),
        switchMap((id) =>
          this.CampaignService.getAllPromsStats(
            id ?? this.campaign.id,
            this.isOwnedByUser
          ).pipe(
            map((data: any) => data.allProms),
            switchMap((array: any) => from(array)),
            filter(
              (prom: any) => prom.status !== 'rejected' && prom.appliedDate
            ),
            concatMap((prom: any) => {
              if (prom.typeSN === '2') {
                return this.CampaignService.videoDescription(prom.idPost).pipe(
                  map((res: any) => {
                    prom.title = res.title;
                    return prom;
                  }),
                  catchError((err) => {
                    return of(prom);
                  })
                );
              }
              return of(prom);
            }),
            concatMap((prom: any) => {
              return this.CampaignService.getBestInfluencerPic(
                prom?.meta?._id
              ).pipe(
                map((res: any) => {
                  let objectURL = URL.createObjectURL(res);

                  prom.pic = prom?.meta?.picLink
                    ? prom?.meta?.picLink
                    : this._sanitizer.bypassSecurityTrustUrl(objectURL);

                  return prom;
                }),
                catchError((err) => {
                  return of(prom);
                })
              );
            }),
            toArray(),
            // map((array) => this.getSocialLinks(array)),
            tap((array: any) => {
              this.promsList = array;
              this.getLink();
              this.publications = array?.length || '0';
              //   this.checkingGains(array);
              this.getStatEarnings(array);
              this.showSpinner = false;
            })
          )
        ),
        shareReplay(1)
      );
    }
  }
  getAge(birthday: any) {
    let timeDiff = Math.abs(Date.now() - new Date(birthday).getTime());
    let age: number = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    return age;
  }

  getMyGains(prom: any) {
    this.blockchainActions.onActionButtonClick({
      data: { prom, bounty: !!this.campaign.bounties.length },
      action: EButtonActions.GET_MY_GAINS
    });
    this.router.navigate(['recover-my-gains'], {
      queryParams: { prom_hash: prom.id, id: this.campaign.id },
      relativeTo: this.activatedRoute
    });
  }

  trackById(index: number, prom: any) {
    return prom;
  }

  sortingPromsArray(array: any) {
    return [
      ...array.filter((prom: any) => prom.disable === false),
      ...array.filter((prom: any) => prom.status === false),
      ...array.filter((prom: any) => prom.disable === true)
    ];
  }

  sortingPromsArrayPublication(array: any) {
    let PromsArray = [
      ...array.filter((prom: any) => prom.isPayed === false),
      ...array.filter((prom: any) => prom.status === false),
      ...array.filter((prom: any) => prom.isPayed === true)
    ];
    return [...new Set(PromsArray)];
  }

  checkingGains(array: any): void {
    if (array?.length) {
      array.forEach((item: any, index: any) => {
        if (
          item.totalToEarn &&
          item.payedAmount &&
          new Big(item.totalToEarn).gte(new Big(item.payedAmount))
        ) {
          item.totalToEarn = new Big(item.totalToEarn)
            .minus(new Big(item.payedAmount))
            .toFixed();
        }
        if (
          item.totalToEarn &&
          compare(item.totalToEarn).gte(this.campaign.budget)
        ) {
          item.totalToEarn = this.campaign.budget;
        }
        if (item.totalToEarn) {
          item.sum = new Big(item.totalToEarn)
            .plus(new Big(item.payedAmount))
            .toFixed();
        }
        //  else if(item.totalToEarn && item.payedAmount=== "0")item.sum = item.totalToEarn
        if (item.reward) {
          let accEarned = new Big(item.reward).minus(
            new Big(item.payedAmount || '0')
          );
          item.reward = item.isPayed === false ? item.reward : item.payedAmount;
          this.gainsTotal = new Big(this.gainsTotal)
            .plus(new Big(accEarned))
            .toFixed();
        }
      });
    }
  }

  getStatEarnings(array: any): void {
    if (array !== []) {
      array.forEach((item: any) => {
        if (
          item.status === true &&
          item.payedAmount &&
          item.payedAmount !== '0'
        ) {
          this.gainsEarned = new Big(this.gainsEarned)
            .plus(new Big(item.payedAmount))
            .toFixed();
        }
        if (item.status === true && item.totalToEarn) {
          this.gainsTotal = new Big(this.gainsTotal)
            .plus(new Big(item.totalToEarn))
            .toFixed();
        }
      });

      if (!this.isOwnedByUser) {
        this.gainsTotal = compare(this.gainsTotal).gte(this.campaign.budget)
          ? this.campaign.budget
          : this.gainsTotal;
        this.sumearning = new Big(this.gainsTotal)
          .div(this.etherInWei)
          .plus(this.gains)
          .gt(this.campaign.budget)
          ? this.campaign.budget
          : new Big(this.gainsTotal)
              .div(this.etherInWei)
              .plus(this.gains)
              .toFixed();
        this.sumearningUSD = this.walletFacade.getCryptoPriceList().pipe(
          map((crypto: any) =>
            (crypto[this.currencyName].price * this.sumearning).toFixed(2)
          ),
          catchError((err) => {
            return of(null);
          })
        );
        let gainsTotalSatt: any = this.fromWeiTo.transform(
          this.gainsTotal,
          this.currencyName
        );
        this.gainsTotalInUsD = this.walletFacade.getCryptoPriceList().pipe(
          map((crypto: any) =>
            (crypto[this.currencyName].price * gainsTotalSatt).toFixed(2)
          ),
          catchError((err) => {
            return of(null);
          })
        );
      }
    }
  }

  get localId(): string {
    return this.tokenStorageService.getLocale() || 'en';
  }
  listenForStyleHost(event: boolean) {
    this.isStyleGrid = event;
  }

  toggleFilter() {
    this.showSort = false;
    this.showFilter = !this.showFilter;
  }
  toggleSort() {
    this.showFilter = false;
    this.showSort = !this.showSort;
  }
  close(type: string) {
    if (type === 'filter') {
      this.showFilter = false;
    } else {
      this.showSort = false;
    }
  }

  sortViews(type: string) {
    if (type === 'up') {
      this.sortDownViews = true;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(b.views) - Number(a.views);
        }
      );
    } else if (type === 'down') {
      this.sortDownViews = false;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(a.views) - Number(b.views);
        }
      );
    }
  }
  sortLikes(type: string) {
    if (type === 'up') {
      this.sortDownLikes = true;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(b.likes) - Number(a.likes);
        }
      );
    } else if (type === 'down') {
      this.sortDownLikes = false;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(a.likes) - Number(b.likes);
        }
      );
    }
  }
  sortShares(type: string) {
    if (type === 'up') {
      this.sortDownShares = true;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(b.shares) - Number(a.shares);
        }
      );
    } else if (type === 'down') {
      this.sortDownShares = false;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(a.shares) - Number(b.shares);
        }
      );
    }
  }
  sortEarnings(type: string) {
    if (type === 'up') {
      this.sortDownEarnings = true;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(b.sum) - Number(a.sum);
        }
      );
    } else if (type === 'down') {
      this.sortDownEarnings = false;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(a.sum) - Number(b.sum);
        }
      );
    }
  }
  sortRestToClaim(type: string) {
    if (type === 'up') {
      this.sortDownRestToClaim = true;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(b.payedAmount) - Number(a.payedAmount);
        }
      );
    } else if (type === 'down') {
      this.sortDownRestToClaim = false;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(a.payedAmount) - Number(b.payedAmount);
        }
      );
    }
  }
  sortDate(type: string) {
    if (type === 'up') {
      this.sortDownDate = true;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return b.applyDate.getTime() - a.applyDate.getTime();
        }
      );
    } else if (type === 'down') {
      this.sortDownDate = false;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return a.applyDate.getTime() - b.applyDate.getTime();
        }
      );
    }
  }
  sortSendName(type: string) {
    if (type === 'up') {
      this.sortDownSendBy = true;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return b.meta.firstName.localeCompare(a.meta.firstName);
        }
      );
    } else if (type === 'down') {
      this.sortDownSendBy = false;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return a.meta.firstName.localeCompare(b.meta.firstName);
        }
      );
    }
  }
  sortMedia(type: string) {
    if (type === 'up') {
      this.sortDownMedia = true;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return b.oracle.localeCompare(a.oracle);
        }
      );
    } else if (type === 'down') {
      this.sortDownMedia = false;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return a.oracle.localeCompare(b.oracle);
        }
      );
    }
  }
  sortAbosNumber(type: string) {
    if (type === 'up') {
      this.sortDownAbosNumber = true;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(b.abosNumber) - Number(a.abosNumber);
        }
      );
    } else if (type === 'down') {
      this.sortDownAbosNumber = false;
      this.campaignLinks = this.campaignLinks.sort(
        (a: Participation, b: Participation) => {
          return Number(a.abosNumber) - Number(b.abosNumber);
        }
      );
    }
  }
}
