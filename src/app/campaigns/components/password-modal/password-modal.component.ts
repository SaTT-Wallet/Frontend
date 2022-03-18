import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { Big } from 'big.js';
import {
  campaignSmartContractERC20,
  campaignSmartContractBEP20,
  cryptoNetwork,
  ListTokens,
  GazConsumedByCampaign
} from '@config/atn.config';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { DraftCampaignStoreService } from '@core/services/draft-campaign-store.service';
import { Campaign } from '@app/models/campaign.model';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  retry,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { param } from 'jquery';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';

enum EOraclesID {
  'facebook' = 1,
  'youtube',
  'instagram',
  'twitter',
  'linkedin'
}
@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.css']
})
export class PasswordModalComponent implements OnInit {
  @Input() campaign = new Campaign();

  passwordForm = new FormGroup({});

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
  gazsend: any;
  erc20Gaz: any;
  bepGaz: any;
  private isDestroyed = new Subject();

  constructor(
    private _formBuilder: FormBuilder,
    private campaignService: CampaignHttpApiService,
    public router: Router,
    private tokenStorageService: TokenStorageService,
    private _fetchPrice: CryptofetchServiceService,
    private toastr: ToastrService,
    public translate: TranslateService,
    private campaignsStore: CampaignsStoreService,
    private route: ActivatedRoute,
    private Fetchservice: CryptofetchServiceService,
    private walletFacade: WalletFacadeService
  ) {
    this.route.queryParams
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((params: any) => {
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
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((data: any) => {
        this.cryptodata = data;
      });
    this.passwordForm = this._formBuilder.group({
      password: ['', Validators.required]
    });

    // if (!this.campaign.id) {
    //   this.route.queryParams.subscribe((params: any) => {
    //     this.router.navigate(["home/campaign", params["id"], "edit"]);
    //     console.log(params["id"]);
    //   });
    // }
    this.parentFunction();
  }

  creatYourCampaign() {
    this.errorMessage = '';
    let token = this.campaign?.currency?.name;
    this.allowance(token);
  }

  fillInformations(getinfo?: any) {
    let _campaign: any = {};
    if (this.campaign) {
      _campaign.dataUrl =
        'https://ropsten.etherscan.io/token/0x2bef0d7531f0aae08adc26a0442ba8d0516590d0'; //this.campaign.shortLink;
      _campaign.token = this.tokenStorageService.getToken();
      _campaign.pass = this.passwordForm.get('password')?.value;
      _campaign.ERC20token = ListTokens[this.campaign.currency.name].contract;
      _campaign.amount = this.campaign?.initialBudget;
      _campaign.contract =
        ListTokens[this.campaign.currency.name].type === 'bep20'
          ? campaignSmartContractBEP20
          : campaignSmartContractERC20;
      if (this.campaign.remuneration === 'performance') {
        _campaign.ratios = this.handleRatios();
      }
      if (this.campaign.remuneration === 'publication') {
        _campaign.bounties = this.handleBounties();
      }

      // A ne pas changer +60 Minute
      _campaign.startDate = this.calculateStartDate(this.campaign.startDate);

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
    let date = new Date();
    if (startDate.getMinutes() < 30) {
      return Math.floor(
        date.setMinutes(
          this.campaign.startDate.getMinutes() +
            60 +
            (30 - startDate.getMinutes())
        ) / 1000
      );
    } else if (startDate.getMinutes() > 30) {
      return Math.floor(
        date.setMinutes(
          this.campaign.startDate.getMinutes() +
            60 +
            (60 - startDate.getMinutes())
        ) / 1000
      );
    } else {
      return Math.floor(
        date.setMinutes(this.campaign.startDate.getMinutes() + 60) / 1000
      );
    }
  }

  erc20Fee(campaign: any) {
    let token = this.fillInformations('ERC20token');
    let data = this.campaign;
    if (token !== ListTokens['SATT'].contract) {
      data.initialBudget = ((data.initialBudget as any) * 0.9).toString();
      let fee = new Big(data?.initialBudget)
        .times(this.etherInWei)
        .toFixed(30)
        .split('.')[0];
      let _FeeObj: any = {};

      _FeeObj.to = campaignSmartContractERC20;
      _FeeObj.pass = this.fillInformations('pass');
      _FeeObj.access_token = this.fillInformations('token');
      _FeeObj.token = token;
      _FeeObj.amount = fee;
      return this.campaignService
        .eRC20Fee(_FeeObj)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((data: any) => {});
    } else return;
  }
  parentFunction() {
    return this.walletFacade.getCryptoPriceList().pipe(
      map((data: any) => {
        this.bnb = data['BNB'].price;
        this.eth = data['ETH'].price;
        return {
          bnb: this.bnb,
          Eth: this.eth
        };
      }),
      switchMap(({ bnb, Eth }) => {
        return forkJoin([
          this.walletFacade.getEtherGaz().pipe(
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
          )
        ]);
      })
    );
  }

  allowance(token: any) {
    let TokenOBj: any = {};
    let TokenOBjBEP20: any = {};
    let campaign_info = this.fillInformations();

    let confirmationContent = [
      'cost',
      'cost_usd',
      'countries',
      'description',
      'hash',
      'ratios',
      'resume',
      'tags',
      'time',
      'title',
      'token'
    ];
    this.showButtonSend = false;
    this.loadingButton = true;
    TokenOBj.walletaddr = this.tokenStorageService.getIdWallet();
    TokenOBj.addr = ListTokens[this.campaign.currency.name].contract;
    TokenOBjBEP20.addr = ListTokens[this.campaign.currency.name].contract;
    TokenOBjBEP20.walletaddr = this.tokenStorageService.getIdWallet();
    campaign_info.currency = cryptoNetwork[token];
    if (cryptoNetwork[token] === 'BEP20') {
      this.campaignService
        .getTokenAllowanceBEP20(TokenOBjBEP20)
        .pipe(
          switchMap((response: any) => {
            this.passwordForm.reset();
            if (
              new Big(response.allowance.amount).gt(
                new Big(this.campaign.initialBudget)
              )
            ) {
              if (this.campaign.remuneration === 'performance') {
                return this.launchCampaignWithPerPerformanceReward(
                  campaign_info,
                  confirmationContent
                );
              } else if (this.campaign.remuneration === 'publication') {
                return this.launchCampaignWithPerPublicationReward(
                  campaign_info
                );
              }
            }

            return this.campaignService
              .tokenApproveBEP20(TokenOBjBEP20, campaign_info.pass)
              .pipe(
                tap((response: any) => {
                  if (response['error'] === 'Wrong password') {
                    this.errorMessage = 'wrong_password';
                  }
                }),
                concatMap(() => {
                  if (this.campaign.remuneration === 'performance') {
                    return this.launchCampaignWithPerPerformanceReward(
                      campaign_info,
                      confirmationContent
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
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((data) => {
          if (
            data.error ===
            'Returned error: insufficient funds for gas * price + value'
          ) {
            if (cryptoNetwork[token] === 'BEP20') {
              this.errorMessage =
                'You dont have enough BNB gaz (BNB : $ ' + this.bepGaz + ')';
              this.loadingButton = false;
            } else {
              this.errorMessage =
                'Yout dont have enough ETH gaz (ETH :$ ' + this.erc20Gaz + ')';
              this.loadingButton = false;
            }
          }
          if (data.transactionHash) {
            this.launchCampaignWithPerPerformanceReward(
              campaign_info,
              confirmationContent
            );
          }
        });

      // // @ts-ignore
      // console.log(TokenOBj)

      // this.campaignService
      //   .getTokenAllowanceBEP20(TokenOBjBEP20)
      //   .pipe()
      //   .subscribe((data: any) => {
      //     this.passwordForm.reset();
      //     //console.log({ data });
      //     this.allowanceObj = data;
      //     let cost = new Big(this.campaign?.initialBudget).times(
      //       this.etherInWei
      //     );
      //     let allowance = new Big(this.allowanceObj.allowance.amount);
      //     if (allowance.gt(cost)) {
      //       this.launchCampaignWithPerPerformanceReward(
      //         campaign_info,
      //         confirmationContent
      //       );
      //     } else {
      //       this.campaignService
      //         .tokenApproveBEP20(TokenOBjBEP20, campaign_info.pass)
      //         .subscribe((data: any) => {
      //           //console.log(data);
      //           if (data["error"]) {
      //             this.errorMessage = data["error"];
      //             setTimeout(() => {
      //               this.errorMessage = "";
      //             }, 5000);
      //           }
      //         });
      //     }
      //   });
    } else {
      this.campaignService
        .getTokenAllowanceERC20(TokenOBj)
        .pipe(
          switchMap((response: any) => {
            this.passwordForm.reset();
            if (
              new Big(response.allowance.amount).gt(
                new Big(this.campaign.initialBudget)
              )
            ) {
              if (this.campaign.remuneration === 'performance') {
                return this.launchCampaignWithPerPerformanceReward(
                  campaign_info,
                  confirmationContent
                );
              } else if (this.campaign.remuneration === 'publication') {
                return this.launchCampaignWithPerPublicationReward(
                  campaign_info
                );
              }
            }

            return this.campaignService
              .tokenApproveERC20(TokenOBj, campaign_info.pass)
              .pipe(
                tap((response: any) => {
                  if (response['error'] === 'Wrong password') {
                    this.errorMessage = 'wrong_password';
                  }
                }),
                concatMap(() => {
                  if (this.campaign.remuneration === 'performance') {
                    return this.launchCampaignWithPerPerformanceReward(
                      campaign_info,
                      confirmationContent
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
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((data) => {
          if (
            data.error ===
            'Returned error: insufficient funds for gas * price + value'
          ) {
            if (cryptoNetwork[token] === 'BEP20') {
              this.errorMessage =
                'You dont have enough BNB gaz (BNB : $ ' + this.bepGaz + ')';
            } else {
              this.errorMessage =
                'Yout dont have enough ETH gaz (ETH :$ ' + this.erc20Gaz + ')';
            }
          }
          if (data.transactionHash) {
            this.launchCampaignWithPerPerformanceReward(
              campaign_info,
              confirmationContent
            );
          }
        });
    }
  }

  launchCampaignWithPerPerformanceReward(
    campaign_info: any,
    confirmationContent: any
  ) {
    return this.campaignService.createCompaign(campaign_info).pipe(
      tap((response: any) => {
        //let _campaign_Hash = Object.assign({}, this.campaign as any);
        this.showButtonSend = true;
        this.loadingButton = false;
        this.passwordForm.reset();

        if (
          response['error'] ===
          'Returned error: insufficient funds for gas * price + value'
        ) {
          // this.errorMessage = "out_of_gas_error";
        } else if (response['error'] === 'Wrong password') {
          this.errorMessage = 'wrong_password';
        } else if (response['transactionHash']) {
          this.campaignService.inProgressCampaign(this.campaign.id);

          // Swal.fire({
          //   icon: "success",
          //   title: "Campaign has been created with success",
          //   showConfirmButton: true,
          //   confirmButtonColor: "#4048FF",
          // })
          this.transactionHash = response['transactionHash'];
          this.showcampaignSuccess = true;
          this.showpassword = false;
        } else {
          Swal.fire({
            icon: 'error',
            title: "Sorry, we couldn't treat you request! please try again.",
            showConfirmButton: true,
            confirmButtonColor: '#4048FF'
          });
        }
      })
    );
  }

  launchCampaignWithPerPublicationReward(campaign_info: any) {
    return this.campaignService.launchCampaignWithBounties(campaign_info).pipe(
      tap((response: any) => {
        //let _campaign_Hash = Object.assign({}, this.campaign as any);
        this.showButtonSend = true;
        this.loadingButton = false;
        this.passwordForm.reset();

        if (
          response['error'] ===
          'Returned error: insufficient funds for gas * price + value'
        ) {
          //  this.errorMessage = "out_of_gas_error";
        } else if (response['error'] === 'Wrong password') {
          this.errorMessage = 'wrong_password';
        } else if (response['transactionHash']) {
          this.campaignService.inProgressCampaign(this.campaign.id);

          // Swal.fire({
          //   icon: "success",
          //   title: "Campaign has been created with success",
          //   showConfirmButton: true,
          //   confirmButtonColor: "#4048FF",
          // })
          this.transactionHash = response['transactionHash'];
          this.showcampaignSuccess = true;
          this.showpassword = false;
        } else {
          Swal.fire({
            icon: 'error',
            title: "Sorry, we couldn't treat you request! please try again.",
            showConfirmButton: true,
            confirmButtonColor: '#4048FF'
          });
        }
      })
    );
  }

  //dicimal handel
  convertAmount(amount: any, token: string) {
    let _amount = ListTokens[token].decimals.toString();

    return _amount;
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
      ) || 0
    ];
  }

  handleBounties() {
    let array: any[] = [];
    if (!!this.campaign) {
      this.campaign.bounties.forEach((bounty: any, bountyIndex: number) => {
        bounty.categories.forEach((category: any, categoryIndex: number) => {
          array.push(
            category.minFollowers,
            category.maxFollowers,
            this.eOraclesID[bounty.oracle],
            category.reward
          );
        });
      });
    }

    return array;
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
