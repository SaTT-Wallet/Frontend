import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { Big } from 'big.js';
import {
  GazConsumedByCampaign,
  pattContact,
  ListTokens
} from '@config/atn.config';

import { SidebarService } from '@core/services/sidebar/sidebar.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TranslateService } from '@ngx-translate/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilesService } from '@core/services/files/files.Service';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { Router } from '@angular/router';

import { WalletStoreService } from '@core/services/wallet-store.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { bscan, etherscan } from '@app/config/atn.config';
import { ShowNumbersRule } from '@app/shared/pipes/showNumbersRule';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';
@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('inputAmountUsd') inputAmountUsd?: ElementRef;
  sendform: FormGroup;
  typetab: string = '';
  btcCode: string = '';
  selectedValue: any;
  totalAmount: any;
  amountdefault: any;
  selectedCryptoSend: any;
  noCryptoSelected: boolean = false;
  loading: boolean = false;
  showButtonReceive: boolean = true;
  loadingButtonReceive!: boolean;
  isSubmitting!: boolean;
  showSpinner!: boolean;
  loadingButton!: boolean;

  wrongpassword: boolean = false;
  ownaddress: boolean = false;

  hashtransaction: string = '';
  amountUsd: any;
  amount: any;
  gazsend: any;
  dataList: any[] = [];
  bEPGaz: any;
  currency: any;
  bnb: any;
  eth: any;
  eRC20Gaz: any;

  defaultcurr: string = ListTokens['SATT'].name;
  private isDestroyed = new Subject();

  cryptoList: any = [];
  newquantity: any;
  difference: any;
  paramsSubscription: any;
  showBigSpinner: boolean = false;
  showWalletSpinner: boolean = true;
  coinType: boolean = false;
  gazsendether: any;
  currentUser: any;
  network: string = '';
  totalBalance$ = this.walletFacade.totalBalance$;
  cryptoList$ = this.walletFacade.cryptoList$;
  quantitysatt: any;
  gazproblem: boolean = false;
  nobalance: boolean = false;
  networks: any;
  decimals: any;
  token: any;
  symbol: any;
  gazcurrency: any;
  /*--------------------------------*/
  @ViewChild('checkUserLegalKYCModal') checkUserLegalKYCModal!: ElementRef;
  routeEventSubscription$ = new Subject();
  showAmountBloc: boolean = true;
  showPwdBloc: boolean = false;
  showSuccessBloc: boolean = false;
  showErrorBloc: boolean = false;
  selectedCryptoDetails: any = '';
  routertransHash: string = '';
  private account$ = this.accountFacadeService.account$;
  cryptoToDropdown: any;
  contactWallet: string = '';
  maxNumber: number = 999999999;
  sattBalance: any;
  constructor(
    private accountFacadeService: AccountFacadeService,
    public sidebarService: SidebarService,
    public modalService: NgbModal,
    public translate: TranslateService,
    private fileService: FilesService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private walletStoreService: WalletStoreService,
    private walletFacade: WalletFacadeService,
    private clipboard: Clipboard,
    private showNumbersRule: ShowNumbersRule,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    private _location: Location
  ) {
    //, Validators.max(this.maxNumber)
    this.sendform = new FormGroup({
      contact: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(pattContact)]
      }),
      Amount: new FormControl(0, Validators.compose([Validators.required])),
      AmountUsd: new FormControl(null),
      currency: new FormControl(null),
      password: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    this.sendform.get('currency')?.setValue('SATT');

    this.parentFunction().pipe(takeUntil(this.isDestroyed)).subscribe();
    this.getusercrypto();
    this.getProfileDetails();
    this.amountdefault = this.sendform.get('currency')?.value;
  }

  //get list of crypto for user
  getusercrypto() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let address = this.tokenStorageService.getIdWallet();
    this.showWalletSpinner = true;
    this.parentFunction()
      .pipe(
        switchMap(() => {
          return this.totalBalance$.pipe(
            tap((data: any) => {
              this.totalAmount = parseFloat(data?.Total_balance?.Total_balance);
            }),
            switchMap(() => {
              return this.cryptoList$.pipe(filter((data) => data.length !== 0));
            })
          );
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe((data: any) => {
        this.walletFacade.hideWalletSpinner();
        this.showWalletSpinner = false;
        data = JSON.parse(JSON.stringify(data));
        this.dataList = data;
        this.cryptoList = [
          ...this.dataList.filter((data: any) => data.symbol === 'SATT'),

          ...this.dataList.filter((data: any) => data.symbol === 'SATTBEP20'),

          ...this.dataList.filter((data: any) => data.symbol === 'WSATT'),
          ...this.dataList.filter((data: any) => data.symbol === 'BITCOIN'),
          ...this.dataList.filter((data: any) => data.symbol === 'BNB'),
          ...this.dataList.filter((data: any) => data.symbol === 'ETH'),
          ...this.dataList
            .filter(
              (data: any) =>
                data.symbol !== 'WSATT' &&
                data.symbol !== 'SATTBEP20' &&
                data.symbol !== 'SATT' &&
                data.symbol !== 'BITCOIN' &&
                data.symbol !== 'BNB' &&
                data.symbol !== 'ETH'
            )
            .reverse()
        ];
        this.dataList?.forEach((crypto: any) => {
          crypto.price = this.filterAmount(crypto.price + '');
          crypto.variation = parseFloat(crypto.variation + '');
          crypto.quantity = this.filterAmount(crypto.quantity + '');
          crypto.total_balance = parseFloat(crypto.total_balance + '');
          crypto.total_balance = crypto?.total_balance?.toFixed(2);
          crypto.type =
            crypto.network ?? ListTokens[crypto.symbol].type.toUpperCase();
          crypto.undername2 = crypto.undername2 ?? 'indispo';
          crypto.undername = crypto.undername ?? 'indispo';
          crypto.typetab = crypto.type;
          crypto.contrat = crypto.AddedToken || '';
          if (crypto.symbol === 'ETH') {
            this.gazsendether = (this.gazsend / crypto.price).toFixed(8);
          }
          if (crypto.symbol === 'BTC') {
            crypto.typetab = 'BTC';
          }
          if (crypto.symbol === 'SATT') {
            this.sattBalance = crypto.total_balance;
            this.symbol = crypto.symbol;
          }
        });
        this.showWalletSpinner = false;
      });
  }

  //get user Data
  getProfileDetails() {
    this.showSpinner = true;
    this.account$
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.routeEventSubscription$)
      )
      .subscribe((data) => {
        this.showSpinner = false;
        this.currentUser = data;
      });
  }

  // fixing crypto decimals to 9
  filterAmount(input: any, nbre: any = 10) {
    if (input) {
      var out = input;
      let size = input.length;
      let toAdd = parseInt(nbre) - parseInt(size);

      if (input === 0) {
        toAdd--;
      }
      if (toAdd > 0) {
        if (input.includes('.')) {
          for (let i = 0; i < toAdd; i++) {
            out += '0';
          }
        } else {
          out += '.';
          for (let i = 0; i < toAdd; i++) {
            out += '0';
          }
        }
      } else if (toAdd < 0) {
        if (input.includes('.')) {
          if (input.split('.')[0].length > nbre) {
            out = input.substring(0, nbre);
          } else {
            out = input.substring(0, nbre);
            if (out[nbre - 1] === '.') {
              out = input.substring(0, nbre - 1);
            }
          }
        }
      }
      return out;
    } else {
      return '-';
    }
  }
  restrictZero(event: any) {
    if (event.target.value.length === 0 && event.key === '0') {
      event.preventDefault();
    }
  }

  //check legal kyc before send
  onSubmitSendMoney(event: any) {
    this.isSubmitting = true;
    if (this.sendform.valid) {
      this.showSpinner = true;
      event.preventDefault();
      event.stopPropagation();
      this.fileService
        .getListUserLegal()
        .pipe(
          map((data: any) =>
            Object.keys(data.legal).map((key) => ({
              value: data.legal[key]
            }))
          ),
          takeUntil(this.isDestroyed)
        )
        .subscribe((items) => {
          if (
            items.length > 1 &&
            items.reduce((acc: any, item: any) => {
              return acc && item.value['validate'] === true;
            }, true)
          ) {
            this.sendMoney();
            //this.sendform.reset();
            this.showSpinner = false;
            this.isSubmitting = false;
          } else {
            this.showSpinner = false;
            this.modalService.open(this.checkUserLegalKYCModal);
            this.isSubmitting = false;
          }
        });
    } else {
      this.showSpinner = false;
    }
  }
  resetchecker() {
    this.nobalance = false;
    this.wrongpassword = false;
    this.gazproblem = false;
    this.noCryptoSelected = false;
  }

  openModal(content: any) {
    this.modalService.open(content);
  }

  closeModal(content: any) {
    this.modalService.dismissAll(content);
  }
  resetForm() {
    this.sendform.reset();
    this.network = '';
    this.token = null;
    this.amountUsd = null;
    this.amount = null;
  }
  //send crypto

  public sendMoney() {
    let token: any;
    if (this.sendform.valid) {
      this.showSpinner = true;
      this.loading = true;
      let symbole: any;
      let decimal: any;
      this.loadingButton = true;

      let splitted: any = this.sendform.get('Amount')?.value;
      this.resetchecker();
      const access_token = this.tokenStorageService.getToken();
      const to = this.sendform.get('contact')?.value;
      const amountdecimal = splitted.toString();
      let amount = splitted.toString();
      let currency = '';
      const pass = this.sendform.get('password')?.value;
      currency = this.sendform.get('currency')?.value;

      let address = this.tokenStorageService.getIdWallet();
      // if (to === address) {
    
      //   this.ownaddress = true;
      //   this.loadingButton = false;
      //   setTimeout(() => {
      //     this.ownaddress = false;
      //   }, 5000);
      // } else {
        if (this.selectedCryptoSend) {
          currency = this.selectedCryptoSend;
        } else {
          currency = this.sendform.get('currency')?.value;
        }
        this.network = this.networks
          ? this.networks.toLowerCase()
          : ListTokens[currency].type;
        if (this.network === 'bep20' && currency === 'SATT') {
          currency = 'SATTBEP20';
        }

        token = this.token ? this.token : ListTokens[currency].contract;

        decimal = this.decimals
          ? new Big('10').pow(this.decimals)
          : ListTokens[currency].decimals;

        amount = new Big(amountdecimal)
          .times(decimal)
          .toFixed(30)
          .split('.')[0];
        // symbole = this.symbol ? this.symbol : ListTokens[currency].symbole;
        symbole = this.sendform.get('currency')?.value
        let network = this.networks
          ? this.networks.toLowerCase()
          : ListTokens[currency].type;
        const send: any = {
          token,
          access_token,
          to,
          amount,
          pass,
          symbole,
          network,
          decimal: this.decimals
        };
        this.sendform.get('password')?.reset();
        this.walletFacade
          .sendAmount(send)
          .pipe(
            tap(() => {
              // after sending amount we update total balance and crypto list state
              this.walletStoreService.init();
            }),
            takeUntil(this.isDestroyed)
          )
          .subscribe(
            (data: any) => {
              this.showSpinner = false;
              this.loadingButton = false;
              if (data.data.transactionHash) {
                this.currency = currency;

                this.hashtransaction = data.data.transactionHash;

                if (this.networks === 'BEP20') {
                  this.routertransHash = bscan + this.hashtransaction;
                } else {
                  this.routertransHash = etherscan + this.hashtransaction;
                }
                this.showPwdBloc = false;
                this.showSuccessBloc = true;
              }
              // if (data.error === 'Wrong password') {
              //   this.wrongpassword = true;
              //   setTimeout(() => {
              //     this.wrongpassword = false;
              //   }, 5000);
              // }
              
              // else if (
              //   data.error ===
              //     'Returned error: execution reverted: BEP20: transfer amount exceeds balance' ||
              //   data.error ===
              //     'Returned error: execution reverted: ERC20: transfer amount exceeds balance'
              // ) {
              //   this.nobalance = true;
              //   setTimeout(() => {
              //     this.nobalance = false;
              //     this.amountUsd = '';
              //     this.amount = '';
              //     this.showAmountBloc = true;
              //     this.showPwdBloc = false;
              //   }, 3000);
              //   this.sendform.reset();
              // } 
              
              // else if (data.message === 'not_enough_budget') {
              //   this.nobalance = true;
              //   setTimeout(() => {
              //     this.nobalance = false;
              //   }, 3000);
              // } 
              
              
              // else if (
              //   data.error ===
              //     'Returned error: insufficient funds for gas * price + value' ||
              //   data.error === 'Returned error: transaction underpriced'
              // ) {
              //   this.showSuccessBloc = false;
              //   this.showAmountBloc = false;
              //   this.showPwdBloc = false;
              //   this.showErrorBloc = true;
              //   this.amountUsd = '';
              //   this.amount = '';
              //   this.wrongpassword = false;
              //   this.gazproblem = true;
              //   // setTimeout(() => {
              //   //   this.gazproblem = false;
              //   // }, 5000);
              //   this.sendform.reset();
              // }
            },
            (error) => {
              if (error.error.error === 'Key derivation failed - possibly wrong password') {
                this.wrongpassword = true;
                setTimeout(() => {
                  this.wrongpassword = false;
                }, 5000);
              }

                  
              else if (
                error.error.error ===
                  'Returned error: execution reverted: BEP20: transfer amount exceeds balance' ||
                  error.error.error ===
                  'Returned error: execution reverted: ERC20: transfer amount exceeds balance'
              ) {
                this.nobalance = true;
                setTimeout(() => {
                  this.nobalance = false;
                  this.amountUsd = '';
                  this.amount = '';
                  this.showAmountBloc = true;
                  this.showPwdBloc = false;
                }, 3000);
                this.sendform.reset();
              } 

              else if (error.error.error === 'not_enough_budget') {
                this.nobalance = true;
                setTimeout(() => {
                  this.nobalance = false;
                }, 3000);
              } 
              

              else if (
                error.error.error ===
                  'insufficient funds for gas') {
                this.showSuccessBloc = false;
                this.showAmountBloc = false;
                this.showPwdBloc = false;
                this.showErrorBloc = true;
                this.amountUsd = '';
                this.amount = '';
                this.wrongpassword = false;
                this.gazproblem = true;
                // setTimeout(() => {
                //   this.gazproblem = false;
                // }, 5000);
                this.sendform.reset();
              }


              this.showSpinner = false;
              this.loadingButton = false;
            }
          );
      // }
    }
  }
  onClickAmount(): void {
    let currency = '';
    this.selectedCryptoSend = currency;

    if (this.selectedCryptoSend) {
      currency = this.selectedCryptoSend;
    } else {
      currency = this.sendform.get('currency')?.value;
    }

    if (!currency || currency === '?') {
      this.noCryptoSelected = true;
      setTimeout(() => {
        this.noCryptoSelected = false;
      }, 3000);
    }
    if (currency) {
      this.dataList?.forEach((crypto: any) => {
        if (crypto.symbol === currency) {
          let quantity = this.showNumbersRule.transform(crypto.quantity);
          //  let totalBal = this.showNumbersRule.transform(crypto.total_balance);
          this.sendform.get('Amount')?.setValue(quantity),
            this.sendform.get('AmountUsd')?.setValue(crypto.total_balance);

          this.gazproblem = false;
          if (currency === 'ETH' || currency === 'BNB') {
            this.difference = crypto.total_balance - this.gazsend;
            this.newquantity = this.difference / crypto.price;
            let newqua = this.showNumbersRule.transform(this.newquantity);
            let quantit = this.showNumbersRule.transform(crypto.quantity);
            if (this.difference < 0) {
              this.sendform.get('Amount')?.setValue(quantit),
                this.sendform.get('AmountUsd')?.setValue('0');
              this.gazproblem = true;
              setTimeout(() => {
                this.gazproblem = false;
              }, 3000);
            } else {
              this.sendform.get('Amount')?.setValue(newqua),
                this.sendform
                  .get('AmountUsd')
                  ?.setValue(this.difference.toFixed(2));

              this.gazproblem = false;
            }
          }
        }
      });
    }
  }
  //validation send
  isValid(controlName: any) {
    return this.sendform.get(controlName)?.invalid;
  }

  //calculate gaz for erc20 and bep20
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
              this.showSpinner = false;
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

              this.showSpinner = false;
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
          )
        ]);
      })
    );
  }

  /*------------------------ */
  convertcurrency(event: any): void {
    // if (event === 'amount') {
    //   this.sendform
    //     .get('Amount')
    //     ?.setValue(
    //       this.replaceNonAlphanumeric(this.sendform.get('Amount')?.value)
    //     );
    // } else {
    //   this.sendform
    //     .get('AmountUsd')
    //     ?.setValue(
    //       this.replaceNonAlphanumeric(this.sendform.get('AmountUsd')?.value)
    //     );
    // }

    let currency = '';
    var getamount: any = this.sendform.get('Amount')?.value;
    let getusd: any = this.sendform.get('AmountUsd')?.value;
    let sendamount = getamount?.toString();
    let sendusd = getusd?.toString();

    if (event === 'usd' && Number(sendusd) > this.maxNumber) {
      sendusd = sendusd.slice(0, 9);
      this.sendform.get('AmountUsd')?.setValue(sendusd);
    } else {
      this.selectedCryptoSend = currency;
      if (this.selectedCryptoSend) {
        currency = this.selectedCryptoSend;
      } else {
        currency = this.sendform.get('currency')?.value;
      }
      this.dataList?.forEach((crypto: any) => {
        if (!!this.totalAmount && !!this.dataList) {
          if (
            event === 'amount' &&
            sendamount !== undefined &&
            !isNaN(sendamount) &&
            crypto.symbol === currency
          ) {
            this.amountUsd = crypto.price * sendamount;
            this.amountUsd = this.showNumbersRule.transform(this.amountUsd);
            if (isNaN(this.amountUsd)) {
              this.amountUsd = '';
              this.amount = '';
            }
          } else if (
            event === 'amount' &&
            (sendamount === undefined || isNaN(sendamount))
          ) {
            this.amountUsd = '';
          }
          if (
            event === 'usd' &&
            sendusd !== undefined &&
            !isNaN(sendusd) &&
            crypto.symbol === currency
          ) {
            this.amount = sendusd / crypto.price;
            this.amount = this.showNumbersRule.transform(this.amount);
            if (
              sendamount === '0.00000000' ||
              sendusd === '' ||
              isNaN(this.amount)
            ) {
              this.amountUsd = '';
              this.amount = '';
            }
          } else if (
            event === 'usd' &&
            (sendusd === undefined || isNaN(sendusd))
          ) {
            this.amount = '';
          }

          this.editwidthInput();
        }
      });
    }
  }

  replaceNonAlphanumeric(value: any) {
    return (
      value
        .replace(/[^0-9.]+/g, '')
        // .replace(/^0+/, "")
        .replace(/^\.+/, '0.')
        .replace(/\./, 'x')
        .replace(/\./g, '')
        .replace(/x/, '.')
    );
  }
  ngAfterViewChecked(): void {
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    if (elementinputusd)
      elementinputusd.style.width = elementinputusd.value.length + 1.2 + 'ch';
  }
  editwidthInput() {
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    //  elementinputusd.style.width = 40 + 'px';
    if (elementinputusd)
      elementinputusd.style.width = elementinputusd.value.length + 1.2 + 'ch';
  }
  linstingBack(event: any) {
    if (event === true) {
      if (this.showErrorBloc === true) {
        this.showErrorBloc = false;
        this.showSuccessBloc = false;
        this.showPwdBloc = true;
        this.showAmountBloc = false;
      } else if (this.showSuccessBloc === true) {
        this.amountUsd = '';
        this.amount = '';
        this.showSuccessBloc = false;
        this.showPwdBloc = true;
        this.showAmountBloc = false;
        this.showErrorBloc = false;
      } else if (this.showPwdBloc === true) {
        this.showAmountBloc = true;
        this.showSuccessBloc = false;
        this.showPwdBloc = false;
        this.showErrorBloc = false;
        this.cryptoToDropdown = this.selectedCryptoDetails;
        this.contactWallet = this.sendform.get('contact')?.value;
      } else if (this.showAmountBloc === true) {
        // this.router.navigate(['/wallet']);
        this._location.back();
      }
    }
  }
  linstingCrypto(event: any) {
    // this.resetForm();
    this.sendform.controls.currency.reset();
    this.sendform.controls.Amount.reset();
    this.sendform.controls.AmountUsd.reset();
    this.sendform.controls.password.reset();
    this.selectedCryptoDetails = event;
    this.sendform.get('currency')?.setValue(this.selectedCryptoDetails.symbol);
    this.sendform.get('Amount')?.reset();
    this.sendform.get('AmountUsd')?.reset();
    this.amountdefault = this.sendform.get('currency')?.value;
    this.selectedCryptoSend = event.symbol;
    this.symbol = event.symbol;
    this.networks = event.network;
    this.decimals = event.decimal;
    this.token = event.AddedToken;
    if (this.networks === 'ERC20') {
      this.coinType = false;
      this.gazcurrency = 'ETH';
    } else if (this.networks === 'BEP20') {
      this.coinType = false;
      this.gazcurrency = 'BNB';
    } else if (this.networks === 'BTC') {
      this.coinType = true;
      this.gazcurrency = 'ETH';
    }
    this.dataList?.forEach((crypto: any) => {
      if (this.networks === 'ERC20' || this.networks === 'BTC') {
        this.gazsend = this.eRC20Gaz;
        if (crypto.symbol === 'ETH') {
          this.gazsendether = (this.gazsend / crypto.price).toFixed(8);
        }
      }
      if (this.networks === 'BEP20') {
        this.gazsend = this.bEPGaz;
        if (crypto.symbol === 'BNB') {
          this.gazsendether = (this.gazsend / crypto.price).toFixed(8);
        }
      }
    });
  }

  showNextBloc() {
    this.showAmountBloc = false;
    this.showPwdBloc = true;
    this.showSuccessBloc = false;
  }
  sendAgain() {
    setTimeout(() => {
      this.sendform.get('contact')?.setValue('');
    }, 100);

    this.amountUsd = '';
    this.sendform.reset();
    this.showPwdBloc = false;
    this.showErrorBloc = false;
    this.showSuccessBloc = false;
    this.showAmountBloc = true;
    this.amount = '';
  }
  ngOnDestroy(): void {
    if (!!this.routeEventSubscription$) {
      this.routeEventSubscription$.next('');
      this.routeEventSubscription$.complete();
    }
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
  copyTransactionHash() {
    this.clipboard.copy(this.hashtransaction);
  }
  goToSection(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      const classElement = this.document.getElementsByClassName(id);
      if (classElement.length > 0) {
        classElement[0].scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
