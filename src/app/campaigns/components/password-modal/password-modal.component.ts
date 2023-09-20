import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { Big } from 'big.js';
import {
  campaignSmartContractERC20,
  campaignSmartContractBEP20,
  cryptoNetwork,
  ListTokens,
  GazConsumedByCampaign,
  campaignSmartContractPOLYGON,
  campaignSmartContractBTT,
  campaignSmartContractTRON
} from '@config/atn.config';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaign } from '@app/models/campaign.model';
import {
  concatMap,
  map,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { DraftCampaignStoreService } from '@core/services/draft-campaign-store.service';
import { environment } from '@environments/environment';

enum EOraclesID {
  'facebook' = 1,
  'youtube',
  'instagram',
  'twitter',
  'linkedin',
  'tiktok',
  'threads'
}
@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.css']
})
export class PasswordModalComponent implements OnInit {
  @Input() campaign = new Campaign();
  gasError = false;

  passwordForm = new UntypedFormGroup({});
  date = new Date();
  userbalanceInfo: any;
  cryptodata: any;
  passwordBlockChain: any;
  displayRejectReason: boolean = false;
  errorMessage = '';
  rejectReason: any = '';
  loadingButton!: boolean;
  showButtonSend: boolean = true;
  showcampaignSuccess: boolean = false;
  showpassword: boolean = true;
  allowanceObj: any;
  etherInWei = new Big('1000000000000000000');
  network: any;
  eOraclesID = EOraclesID;
  transactionHash = '';
  bnb: any;
  eth: any;
  btt:any;
  gazsend: any;
  erc20Gaz: any;
  bepGaz: any;
  bttGaz:any;
  private isDestroyed = new Subject();
  matic: any;
  polygonGaz: any;
  idcamp: any;
  private onDestoy$ = new Subject();
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private campaignService: CampaignHttpApiService,
    public router: Router,
    private draftStore: DraftCampaignStoreService,
    private tokenStorageService: TokenStorageService,
    public translate: TranslateService,
    private campaignsStore: CampaignsStoreService,
    private route: ActivatedRoute,
    private walletFacade: WalletFacadeService
  ) {
    this.route.queryParams
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((params: any) => {
        this.network = params['network']
        this.campaign = this.campaignsStore.campaignsListByWalletId.find(
          (c) => c.id === params['id']
        );
        if (!!this.campaign) {
          this.network = this.campaign.currency.type;
        }
      });
  }

  ngOnInit(): void {
    this.walletFacade
      .getCryptoPriceList()
      .pipe(
        map((response: any) => response.data),
        takeUntil(this.isDestroyed)
      )
      .subscribe((data: any) => {
        this.cryptodata = data;
      });
    this.passwordForm = this._formBuilder.group({
      password: ['', Validators.required]
    });
    this.parentFunction().subscribe();
    if(!!this.campaign) this.network = this.campaign.currency.type;
    
  }
  expiredSession() {
    this.tokenStorageService.clear();
    window.open(environment.domainName + '/auth/login', '_self');
  }


  creatYourCampaign() {
    this.walletFacade.verifyUserToken().subscribe((res:any) => {
      if(res.message === "success") {
        this.errorMessage = '';
        let token = this.campaign?.currency?.name;
        this.allowance(token);
      } else this.expiredSession();
    });
    
  }

  convertUnixToDate(x: any) {
    return new Date(x * 1000);
  }

  fillInformations(getinfo?: any) {
    let _campaign: any = {};
    if (this.campaign) {
      _campaign.dataUrl =
        'https://ropsten.etherscan.io/token/0x2bef0d7531f0aae08adc26a0442ba8d0516590d0'; //this.campaign.shortLink;
      _campaign.tokenAddress =
        (this.campaign.currency.name === 'BNB' &&
          ListTokens['SATTBEP20'].contract) ||
        this.campaign.currency.addr;
      _campaign.pass = this.passwordForm.get('password')?.value;
      /*
      _campaign.ERC20token = ListTokens[this.campaign.currency.name].contract;
*/ 
      _campaign.limit = this.campaign.limitParticipation;
      _campaign.amount = this.campaign?.initialBudget;
      switch (ListTokens[this.campaign.currency.name].type) {
        case 'bep20': {
          _campaign.contract = campaignSmartContractBEP20;
          _campaign.network = 'BEP20';
          break;
        }
        case 'erc20': {
          _campaign.contract = campaignSmartContractERC20;
          _campaign.network = 'ERC20';
          break;
        }
        case 'POLYGON': {
          _campaign.contract = campaignSmartContractPOLYGON;
          _campaign.network = 'POLYGON';
          break;
        }
        case 'BTT': {
          _campaign.contract = campaignSmartContractBTT;
          _campaign.network = 'BTTC';
          break;
        }
        case 'TRON': {
          _campaign.contract = campaignSmartContractTRON;
          _campaign.network = 'TRON';
          break;
        }
      }
      if (this.campaign.remuneration === 'performance') {
        _campaign.ratios = this.handleRatios();
      }
      if (this.campaign.remuneration === 'publication') {
        _campaign.bounties = this.handleBounties();
      }

      // A ne pas changer +60 Minute
      _campaign.startDate = this.calculateStartDate(this.campaign?.updatedAt);

      _campaign.endDate = Math.floor(this.campaign.endDate.getTime() / 1000);

      //Math.floor(
      //  date.setDate(new Date().getDate() + +this.campaign.duration) / 1000
      //);
      _campaign.idCampaign = this.campaign.id;
    }
    if (getinfo) {
      return _campaign[getinfo];
    } else {
      return _campaign;
    }
  }

  calculateStartDate(startDate: any) {
 
    
    let date = new Date(startDate);

    
date.setMinutes(date.getMinutes() + 60);
date.setSeconds(0);
let dateInSeconds = Math.floor(date.getTime() / 1000);

    return dateInSeconds;

  }

  parentFunction() {
    return this.walletFacade.getCryptoPriceList().pipe(
      map((response: any) => response.data),
      take(1),
      map((data: any) => {
        this.bnb = data['BNB'].price;
        this.eth = data['ETH'].price;
        this.matic = data['MATIC'].price;
        this.btt = data['BTT'].price;
        return {
          bnb: this.bnb,
          Eth: this.eth,
          matic: this.matic,
          btt: this.btt 
        };
      }),
      switchMap(({ bnb, Eth, matic }) => {
        return forkJoin([
          this.walletFacade.getEtherGaz().pipe(
            take(1),
            tap((gaz: any) => {
              let price;
              price = gaz.data.gasPrice;
              this.gazsend = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                Eth
              ).toFixed(2);
              this.erc20Gaz = this.gazsend;
            })
          ),
          this.walletFacade.getBnbGaz().pipe(
            take(1),
            tap((gaz: any) => {
              let price = gaz.data.gasPrice;
              this.bepGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                bnb
              ).toFixed(2);

              if (this.gazsend === 'NaN') {
                this.gazsend = '';
                let price = gaz.data.gasPrice;
                this.bepGaz = (
                  ((price * GazConsumedByCampaign) / 1000000000) *
                  this.bnb
                ).toFixed(2);
              }
            })
          ),

          

          this.walletFacade.getPolygonGaz().pipe(
            take(1),
            tap((gaz: any) => {
              let price;
              price = gaz.data.gasPrice;

              this.polygonGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                matic
              ).toFixed(8);
            })
          ),


          this.walletFacade.getBttGaz().pipe(
            take(1),
            tap((gaz: any) => {
              let price;
              price = gaz.data.gasPrice;

              this.bttGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                this.btt
              ).toFixed(8);
            })
          )
        ]);
      })
    );
  }

  allowance(token: any) {
    let TokenOBj: any = {};
    let campaign_info = this.fillInformations();
    this.showButtonSend = false;
    this.loadingButton = true;
    let tokenSymbol = this.campaign.currency.name;
    TokenOBj.pass = campaign_info.pass;
    TokenOBj.walletaddr = this.tokenStorageService.getIdWallet();
    TokenOBj.addr = ListTokens[tokenSymbol].contract;
    campaign_info.currency = tokenSymbol;
    let LaunchCampaignObs: Observable<any>;
    if (cryptoNetwork[token] === 'BEP20') {
      LaunchCampaignObs = this.campaignService.approveBEP20(TokenOBj).pipe(
        map((response: any) => response.data),
        switchMap((response: any) => {
          this.passwordForm.reset();
          /*if (
            new Big(response.allowance.amount).gt(
              new Big(this.campaign.initialBudget)
            )
          ) {
            if (this.campaign.remuneration === 'performance') {
              //     confirmationContent
              return this.launchCampaignWithPerPerformanceReward(campaign_info);
            } else if (this.campaign.remuneration === 'publication') {
              //     confirmationContent
              return this.launchCampaignWithPerPublicationReward(campaign_info);
            }
          }*/

          return this.campaignService
            .allowBEP20(TokenOBj, campaign_info.pass)
            .pipe(
              tap((response: any) => {
                if (response['error'] === 'Wrong password') {
                  this.errorMessage = 'wrong_password';
                }
              }),
              concatMap(() => {
                if (this.campaign.remuneration === 'performance') {
                  return this.launchCampaignWithPerPerformanceReward(
                    campaign_info
                  );
                } else if (this.campaign.remuneration === 'publication') {
                  return this.launchCampaignWithPerPublicationReward(
                    campaign_info
                  );
                }
                return of(null);
              }),
              takeUntil(this.isDestroyed)
            );
        })
      );
    } else if (cryptoNetwork[token] === 'POLYGON') {
      LaunchCampaignObs = this.campaignService.approvePOLYGON(TokenOBj).pipe(
        map((response: any) => response.data),
        switchMap((response: any) => {
          this.passwordForm.reset();
          /*if (
            new Big(response.allowance.amount).gt(
              new Big(this.campaign.initialBudget)
            )
          ) {
            if (this.campaign.remuneration === 'performance') {
              //     confirmationContent
              return this.launchCampaignWithPerPerformanceReward(campaign_info);
            } else if (this.campaign.remuneration === 'publication') {
              //     confirmationContent
              return this.launchCampaignWithPerPublicationReward(campaign_info);
            }
          }*/

          return this.campaignService
            .allowPOLYGON(TokenOBj, campaign_info.pass)
            .pipe(
              tap((response: any) => {
                if (response['error'] === 'Wrong password') {
                  this.errorMessage = 'wrong_password';
                }
              }),
              concatMap(() => {
                if (this.campaign.remuneration === 'performance') {
                  return this.launchCampaignWithPerPerformanceReward(
                    campaign_info
                  );
                } else if (this.campaign.remuneration === 'publication') {
                  return this.launchCampaignWithPerPublicationReward(
                    campaign_info
                  );
                }
                return of(null);
              }),
              takeUntil(this.isDestroyed)
            );
        })
      );
    } else if (cryptoNetwork[token] === 'TRON') {
      if (TokenOBj.addr === 'TRX')
        TokenOBj.addr = environment.addresses.smartContracts.WTRX;
      campaign_info.tokenAddress = TokenOBj.addr;
      campaign_info.version = localStorage.getItem('wallet_version');
      LaunchCampaignObs = this.campaignService.approveTRON(TokenOBj).pipe(
        map((response: any) => response.data),
        switchMap((response: any) => {
          this.passwordForm.reset();
          /*if (
            new Big(response.allowance.amount).gt(
              new Big(this.campaign.initialBudget)
            )
          ) {
            if (this.campaign.remuneration === 'performance') {
              //     confirmationContent
              return this.launchCampaignWithPerPerformanceReward(campaign_info);
            } else if (this.campaign.remuneration === 'publication') {
              //     confirmationContent
              return this.launchCampaignWithPerPublicationReward(campaign_info);
            }
          }*/

          return this.campaignService
            .allowTRON(TokenOBj, campaign_info.pass)
            .pipe(
              tap((response: any) => {
                if (response['error'] === 'Wrong password') {
                  this.errorMessage = 'wrong_password';
                }
              }),
              concatMap(() => {
                if (this.campaign.remuneration === 'performance') {
                  return this.launchCampaignWithPerPerformanceReward(
                    campaign_info
                  );
                } else if (this.campaign.remuneration === 'publication') {
                  return this.launchCampaignWithPerPublicationReward(
                    campaign_info
                  );
                }
                return of(null);
              }),
              takeUntil(this.isDestroyed)
            );
        })
      );
    } else if (cryptoNetwork[token] === 'BTT') {
      TokenOBj.addr = environment.addresses.smartContracts.WBTT;
      campaign_info.tokenAddress = TokenOBj.addr;
      LaunchCampaignObs = this.campaignService.approveBTT(TokenOBj).pipe(
        map((response: any) => response.data),
        switchMap((response: any) => {
          this.passwordForm.reset();
          /*if (
            new Big(response.allowance.amount).gt(
              new Big(this.campaign.initialBudget)
            )
          ) {
            if (this.campaign.remuneration === 'performance') {
              //     confirmationContent
              return this.launchCampaignWithPerPerformanceReward(campaign_info);
            } else if (this.campaign.remuneration === 'publication') {
              //     confirmationContent
              return this.launchCampaignWithPerPublicationReward(campaign_info);
            }
          }*/

          return this.campaignService
            .allowBTT(TokenOBj, campaign_info.pass)
            .pipe(
              tap((response: any) => {
                if (response['error'] === 'Wrong password') {
                  this.errorMessage = 'wrong_password';
                }
              }),
              concatMap(() => {
                if (this.campaign.remuneration === 'performance') {
                  return this.launchCampaignWithPerPerformanceReward(
                    campaign_info
                  );
                } else if (this.campaign.remuneration === 'publication') {
                  return this.launchCampaignWithPerPublicationReward(
                    campaign_info
                  );
                }
                return of(null);
              }),
              takeUntil(this.isDestroyed)
            );
        })
      );
    } else {
      LaunchCampaignObs = this.campaignService
        .approvalERC20(TokenOBj)
        .pipe(
          switchMap((response: any) => {
            this.passwordForm.reset();
            /*if (
              new Big(response.data.allowance.amount).gt(
                new Big(this.campaign.initialBudget)
              )
            ) {
              if (this.campaign.remuneration === 'performance') {
                return this.launchCampaignWithPerPerformanceReward(
                  campaign_info
                );
              } else if (this.campaign.remuneration === 'publication') {
                return this.launchCampaignWithPerPublicationReward(
                  campaign_info
                );
              }
            }*/

            return this.campaignService
              .allowERC20(TokenOBj, campaign_info.pass)
              .pipe(
                tap((response: any) => {
                  if (
                    response.error ===
                    'Key derivation failed - possibly wrong password'
                  ) {
                    this.errorMessage = 'wrong_password';
                  }
                }),
                concatMap(() => {
                  if (this.campaign.remuneration === 'performance') {
                    return this.launchCampaignWithPerPerformanceReward(
                      campaign_info
                    );
                  } else if (this.campaign.remuneration === 'publication') {
                    return this.launchCampaignWithPerPublicationReward(
                      campaign_info
                    );
                  }
                  return of(null);
                }),
                takeUntil(this.isDestroyed)
              );
          })
        )
        .pipe(takeUntil(this.isDestroyed));
    }
    LaunchCampaignObs.pipe(
      map((data) => data.data),
      takeUntil(this.isDestroyed)
    ).subscribe(
      (data) => {
        if (data.transactionHash) {
          this.campaignService.inProgressCampaign(this.campaign.id);
          this.transactionHash = data.transactionHash;
          this.showcampaignSuccess = true;
          this.showpassword = false;
        }
      },
      (error) => {
        if (
          error.error.error ===
          'Key derivation failed - possibly wrong password'
        ) {
          this.errorMessage = 'wrong_password';
        }

        this.handleLaunchResponseError(error, token);
      }
    );
  }

    // Common logic for launching campaigns, handles date conversion and common actions.
  private commonCampaignLogic(campaign_info: any, createCampaign: boolean): Observable<any> {
        // Convert the start date to Unix timestamp
    // const startDateUnix = Math.floor(campaign_info.startDate.getTime() / 1000);
    // campaign_info.startDate = startDateUnix;
      console.log(campaign_info.startDate)
    if (campaign_info.currency === 'BNB') {
      campaign_info.tokenAddress = null;
    }
    
      // Determine which campaign method to call based on the 'createCampaign' flag
    const campaignObservable = createCampaign
      && this.campaignService.createCompaign(campaign_info)
      || this.campaignService.launchCampaignWithBounties(campaign_info);

    return campaignObservable.pipe(
      tap(() => {
        // Reset common UI elements and flags after campaign launch
        this.gasError = false;
        this.showButtonSend = true;
        this.loadingButton = false;
        this.passwordForm.reset();
      })
    );
  }

  launchCampaignWithPerPerformanceReward(campaign_info: any) : Observable<any> {
    return this.commonCampaignLogic(campaign_info, true);
  }

  launchCampaignWithPerPublicationReward(campaign_info: any) : Observable<any> {
    return this.commonCampaignLogic(campaign_info, false);
  }

  handleLaunchResponseError(error: any, token: any) {
    if (
      error.error.error ===
      'Returned error: insufficient funds for gas * price + value'
    ) {
      this.gasError = true;
      if (cryptoNetwork[token] === 'BEP20') {
        this.errorMessage =
          'You dont have enough BNB gaz (BNB : $ ' + this.bepGaz + ')';
        this.loadingButton = false;
      } else if (cryptoNetwork[token] === 'POLYGON') {
        this.errorMessage =
          'You dont have enough MATIC gaz (MATIC : $ ' + this.polygonGaz + ')';
        this.loadingButton = false;
      } else {
        this.errorMessage =
          'You dont have enough ETH gaz (ETH :$ ' + this.erc20Gaz + ')';
        this.loadingButton = false;
      }
    } else if (error.error.error.includes('reverted')) {
      this.errorMessage =
        'Error: Transaction has been reverted by blockchain evm';
      this.loadingButton = false;
    } else if (
      error.error.error === 'Key derivation failed - possibly wrong password'
    ) {
      this.errorMessage = 'Wrong password';
      this.loadingButton = false;
    } else {
      this.errorMessage = 'An error has occurred, please try again later';
      this.loadingButton = false;
    }
  }

  //dicimal handel
  convertAmount(amount: any, token: string) {
    let _amount = ListTokens[token].decimals.toString();

    return _amount;
  }
  createNewDraftCampaign(): void {
    this.draftStore
      .addNewDraft(new Campaign())
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((draft: Campaign) => {
        this.idcamp = draft.id || '';
        this.router.navigate(['home/campaign', this.idcamp, 'edit']);
      });
  }
  backToCampaign(): void {
    this.router.navigate(['home/ad-pools']);
  }

  handleRatios() {
    return [
      this.campaign.ratios.find((elem) => elem.oracle === 'facebook')?.like ||
        '0',
      this.campaign.ratios.find((elem) => elem.oracle === 'facebook')?.share ||
        '0',
      this.campaign.ratios.find((elem) => elem.oracle === 'facebook')?.view ||
        '0',
      Number(
        this.campaign.ratios.find((elem) => elem.oracle === 'facebook')
          ?.reachLimit
      ) || 0,
      this.campaign.ratios.find((elem) => elem.oracle === 'youtube')?.like ||
        '0',
      this.campaign.ratios.find((elem) => elem.oracle === 'youtube')?.share ||
        '0',
      this.campaign.ratios.find((elem) => elem.oracle === 'youtube')?.view ||
        '0',
      Number(
        this.campaign.ratios.find((elem) => elem.oracle === 'youtube')
          ?.reachLimit
      ) || 0,
      this.campaign.ratios.find((elem) => elem.oracle === 'instagram')?.like ||
        '0',
      this.campaign.ratios.find((elem) => elem.oracle === 'instagram')?.share ||
        '0',
      this.campaign.ratios.find((elem) => elem.oracle === 'instagram')?.view ||
        '0',
      Number(
        this.campaign.ratios.find((elem) => elem.oracle === 'instagram')
          ?.reachLimit
      ) || 0,
      this.campaign.ratios.find((elem) => elem.oracle === 'twitter')?.like ||
        '0',
      this.campaign.ratios.find((elem) => elem.oracle === 'twitter')?.share ||
        '0',
      this.campaign.ratios.find((elem) => elem.oracle === 'twitter')?.view ||
        '0',
      Number(
        this.campaign.ratios.find((elem) => elem.oracle === 'twitter')
          ?.reachLimit
      ) || 0,
      this.campaign.ratios.find((elem) => elem.oracle === 'linkedin')?.like ||
        '0',
      this.campaign.ratios.find((elem) => elem.oracle === 'linkedin')?.share ||
        '0',
      this.campaign.ratios.find((elem) => elem.oracle === 'linkedin')?.view ||
        '0',
      Number(
        this.campaign.ratios.find((elem) => elem.oracle === 'linkedin')
          ?.reachLimit
      ) || 0,
      this.campaign.ratios.find((elem) => elem.oracle === 'tiktok')?.like ||
        '0',
      this.campaign.ratios.find((elem) => elem.oracle === 'tiktok')?.share ||
        '0',
      this.campaign.ratios.find((elem) => elem.oracle === 'tiktok')?.view ||
        '0',
      Number(
        this.campaign.ratios.find((elem) => elem.oracle === 'tiktok')
          ?.reachLimit
      ) || 0,
      this.campaign.ratios.find((elem) => elem.oracle === 'threads')?.like ||
      '0',
      '0',
      '0',
    Number(
      this.campaign.ratios.find((elem) => elem.oracle === 'threads')
        ?.reachLimit
    ) || 0,
    ];
  }

  handleBounties() {
    if (!this.campaign) {
      return [];
    }
  
    const bountyData: any[] = [];
  
    for (const bounty of this.campaign.bounties) {
      for (const category of bounty.categories) {
        bountyData.push(
          category.minFollowers,
          category.maxFollowers,
          this.eOraclesID[bounty.oracle],
          category.reward
        );
      }
    }
  
    return bountyData;
  }

  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
