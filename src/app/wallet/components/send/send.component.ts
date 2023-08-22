import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  HostListener,
  Renderer2
} from '@angular/core';

import { Big } from 'big.js';
import {
  GazConsumed,
  GazConsumedByCampaign,
  ListTokens,
  pattContact,
  tronPattContact,
  tronScan
} from '@config/atn.config';

import { SidebarService } from '@core/services/sidebar/sidebar.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TranslateService } from '@ngx-translate/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { WalletStoreService } from '@core/services/wallet-store.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { bscan, etherscan, polygonscan, bttscan } from '@app/config/atn.config';
import { ShowNumbersRule } from '@app/shared/pipes/showNumbersRule';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';
import { KycFacadeService } from '@app/core/facades/kyc-facade/kyc-facade.service';
import { BarcodeFormat } from '@zxing/library';
import { ActivatedRoute, Router } from '@angular/router';
import { ITransferTokensRequestBody } from '@app/core/services/wallet/wallet.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('inputAmountUsd') inputAmountUsd?: ElementRef;
  emailPlaceholderText = 'Id wallet';
  sendform: UntypedFormGroup;
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
  ownaddress: boolean = false;
  wrongpassword: boolean = false;
  errorOwnAddress = false;

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
  polygonGaz: any;
  bttGaz: any;
  trxGaz: any;
  max = false;
  maxNumber: number = 999999999;
  matic: any;
  defaultcurr: string = ListTokens['SATT'].name;
  private isDestroyed = new Subject();
  showPass: boolean = false;
  cryptoList: any = [];
  newquantity: any;
  difference: any;
  paramsSubscription: any;
  showBigSpinner: boolean = false;
  showWalletSpinner: boolean = true;
  coinType: boolean = false;
  gasCryptoQuantity: any;
  currentUser: any;
  network: string = '';
  totalBalance$ = this.walletFacade.totalBalance$;
  cryptoList$ = this.walletFacade.cryptoList$;
  quantitysatt: any;
  gazproblem: boolean = false;
  nobalance: boolean = false;
  networks: string = 'ERC20';
  decimals: any;
  token: any;
  symbol: any;
  gazcurrency: string = 'ETH';
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
  maxAmountNumber: number = 999999999;
  maxUsdAmountNumber: number = 9999999999999;
  noTronWallet: boolean = false;
  notValidAdressWallet: boolean = false;

  sattBalance: any;

  allowedFormats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX
  ];
  qrResultString: string | null | undefined;
  showScanner: boolean = false;
  private kyc$ = this.kycFacadeService.kyc$;
  query = '(max-width: 767.98px)';
  mediaQueryList?: MediaQueryList;
  btt: any;
  trx: any;
  etcAddress: any;
  btcAddress: any;
  //:any="^0x[a-fA-F0-9]{40}$";
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (isPlatformBrowser(this.platformId) && event) {
      this.mediaQueryList = window.matchMedia(this.query);

      if (this.mediaQueryList?.matches) {
        this.emailPlaceholderText = 'Id wallet or QR code';
      } else {
        this.emailPlaceholderText = 'Id wallet';
      }
    }
  }
  constructor(
    private accountFacadeService: AccountFacadeService,
    public sidebarService: SidebarService,
    public modalService: NgbModal,
    public translate: TranslateService,
    private tokenStorageService: TokenStorageService,
    private walletStoreService: WalletStoreService,
    private walletFacade: WalletFacadeService,
    private clipboard: Clipboard,
    private showNumbersRule: ShowNumbersRule,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    private _location: Location,
    private kycFacadeService: KycFacadeService,
    private router: Router,
    private localStorage: TokenStorageService,
    private activeRoute: ActivatedRoute,
    private renderer: Renderer2
  ) {
    //, Validators.max(this.maxNumber)
    this.sendform = new UntypedFormGroup({
      contact: new UntypedFormControl(null, {
        validators: [Validators.required, Validators.pattern(pattContact)]
      }),

      Amount: new UntypedFormControl(0, Validators.compose([Validators.required])),
      AmountUsd: new UntypedFormControl(null),
      currency: new UntypedFormControl(null),
      password: new UntypedFormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    
    this.etcAddress = this.localStorage.getIdWallet();
    this.btcAddress = this.localStorage.getWalletBtc();
    this.sendform.get('currency')?.setValue('SATT');
    this.getusercrypto();
    this.getProfileDetails();
    this.amountdefault = this.sendform.get('currency')?.value;
  }

  openqrcode(): void {
    this.showScanner = true;
  }
  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this.sendform.get('contact')?.setValue(resultString);
    this.showScanner = false;
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
        if(this.router.url === '/wallet/send') data.map((crypto: any) => {
          if(crypto.symbol === 'SATT') this.selectedCryptoDetails = crypto
        })
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
            this.gasCryptoQuantity = (this.gazsend / crypto.price).toFixed(8);
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

  //check legal kyc before send
  onSubmitSendMoney(event: any) {
    this.isSubmitting = true;
    if (this.sendform.valid) {
      this.showSpinner = true;
      event.preventDefault();
      event.stopPropagation();
    //   this.kyc$.pipe(takeUntil(this.isDestroyed)).subscribe((response:any) => {
    //     if (response !== null && response !== undefined) {
    //       if(response.name === "JsonWebTokenError") {
    //         this.expiredSession();
    //       } else {
    //         if (
    //           response.legal.length > 1 &&
    //           response.legal.reduce((acc: any, item: any) => {
    //             return acc && item['validate'] === true;
    //           }, true)
    //         ) {
    //           this.sendMoney();
    //           this.showSpinner = false;
    //           this.isSubmitting = false;
    //         } else {
    //           console.log("heyy");
    //           this.sendMoney();
    //           this.showSpinner = false;
    //           // this.modalService.open(this.checkUserLegalKYCModal);
    //           this.isSubmitting = false;
    //         }
    //       }
          
    //     }
    //   });
    // } else {
     
      this.sendMoney();
      this.showSpinner = false;
      this.isSubmitting = false;
    }
    else {
      this.showSpinner = false;
    }
  }
  resetchecker() {
    this.nobalance = false;
    this.wrongpassword = false;
    this.gazproblem = false;
    this.noCryptoSelected = false;
  }

  expiredSession() {
    this.tokenStorageService.clear();
    window.open(environment.domainName + '/auth/login', '_self');
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
    let tokenAddress: any;
    if (this.sendform.valid) {
      this.showSpinner = true;
      this.loading = true;
      let tokenSymbol: any;
      let decimal: any;
      this.loadingButton = true;

      let splitted: any = this.sendform.get('Amount')?.value;
      this.resetchecker();
      const to = this.sendform.get('contact')?.value;
      const amountdecimal = splitted.toString();
      let amount = splitted.toString();
      let currency = '';
      const pass = this.sendform.get('password')?.value;
      currency = this.sendform.get('currency')?.value;

      this.selectedCryptoDetails = {};
      this.selectedCryptoDetails.symbol = currency;

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
      if (this.network !== 'btc' && this.network !== 'tron') {
        if (to === this.etcAddress) {
          this.errorOwnAddress = true;
          setTimeout(() => {
            this.errorOwnAddress = false;
          }, 4000);
          this.sendform.reset();
          this.loadingButton = false;
          return;
        }
      } else if (this.network === 'btc') {
        if (to === this.btcAddress) {
          this.errorOwnAddress = true;
          setTimeout(() => {
            this.errorOwnAddress = false;
          }, 4000);
          this.sendform.reset();
          this.loadingButton = false;

          return;
        }
      }
      if (this.network === 'bep20' && currency === 'SATT') {
        currency = 'SATTBEP20';
      }

      tokenAddress = this.token ? this.token : ListTokens[currency].contract;
      if (tokenAddress === 'BTT') {
        tokenAddress = '0x0000000000000000000000000000000000001010';
      }
      decimal = this.decimals
        ? new Big('10').pow(this.decimals)
        : ListTokens[currency].decimals;

      amount = new Big(amountdecimal).times(decimal).toFixed(30).split('.')[0];
      // symbole = this.symbol ? this.symbol : ListTokens[currency].symbole;
      tokenSymbol = this.sendform.get('currency')?.value;
      // if (this.network === 'btt') {
      //   this.network = 'BTTC';
      // }

      let network = this.networks
        ? this.networks.toLowerCase()
        : ListTokens[currency].type;
      if (network === 'btt') {
        network = 'BTTC';
      }

      if (network === 'bep20') {
        network = 'BEP20';
      }
      if (network === 'erc20') {
        network = 'ERC20';
      }
      const send: ITransferTokensRequestBody = {
        from: this.tokenStorageService.getIdWallet() as string,
        tokenAddress,
        to,
        amount,
        pass,
        tokenSymbol,
        network
      };
      // if (network === 'btt') {
      //   network = 'BTTC';
      // }

      this.sendform.get('password')?.reset();
      this.walletFacade
        .transferTokens(send, this.max)
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
            if(data?.name === "JsonWebTokenError") {
              this.expiredSession();
            } else {
              if (data.data.transactionHash) {
                this.currency = currency;
  
                this.hashtransaction = data.data.transactionHash;
                // if (currency === 'SATTBEP20') {
                //   let currenncySatt = 'SATT';
                //   this.toastr.success(
                //     'You have sent ' +
                //       splitted +
                //       '  ' +
                //       currenncySatt +
                //       '  to  ' +
                //       data.data.address
                //   );
                // } else {
                //   this.toastr.success(
                //     'You have sent ' +
                //       splitted +
                //       '  ' +
                //       currency +
                //       '  to  ' +
                //       data.data.address
                //   );
                // }
                if (this.networks === 'BEP20') {
                  this.routertransHash = bscan + this.hashtransaction;
                } else if (this.networks === 'ERC20') {
                  this.routertransHash = etherscan + this.hashtransaction;
                } else if (this.networks === 'POLYGON') {
                  this.routertransHash = polygonscan + this.hashtransaction;
                } else if (this.networks === 'BTT') {
                  this.routertransHash = bttscan + this.hashtransaction;
                } else if (this.networks === 'TRON') {
                  this.routertransHash = tronScan + this.hashtransaction;
                }
                this.showPwdBloc = false;
                this.showSuccessBloc = true;
              }
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
            if (
              error.error.error ===
                'Key derivation failed - possibly wrong password' ||
              error.error.error === 'Invalid private key provided'
            ) {
              this.wrongpassword = true;
              setTimeout(() => {
                this.wrongpassword = false;
              }, 2000);
            } else if (
              error.error.error ===
                'Returned error: execution reverted: BEP20: transfer amount exceeds balance' ||
              error.error.error ===
                'Returned error: execution reverted: ERC20: transfer amount exceeds balance' ||
              error.error.error === 'Returned error: execution reverted'
            ) {
              this.nobalance = true;
              setTimeout(() => {
                this.nobalance = false;
                this.amountUsd = '';
                this.amount = '';
                this.showAmountBloc = true;
                this.showPwdBloc = false;
              }, 2000);
              this.sendform.reset();
            } else if (
              error.error.error === 'No enough balance to perform withdraw !!'
            ) {
              this.nobalance = true;
              setTimeout(() => {
                this.nobalance = false;
              }, 4000);
            } else if (
              error.error.error === 'insufficient funds for gas' ||
              error.error.error ===
                'Returned error: insufficient funds for gas * price + value'
            ) {
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
              // }, 3000);
              this.sendform.reset();
            } else if (
              error.error.error === "The account doesn't have a tron address !"
            ) {
              this.showErrorBloc = true;
              this.noTronWallet = true;
              this.showSuccessBloc = false;
              this.showAmountBloc = false;
              this.showPwdBloc = false;
            } else if (
              error.error.error ===
              'The recipient address is not a valid tron address !!'
            ) {
              this.showErrorBloc = true;
              this.notValidAdressWallet = true;
              this.ownaddress = false;
              this.showAmountBloc = false;
              this.showPwdBloc = false;
              this.wrongpassword = false;
              this.gazproblem = false;
            } else if (
              error.error.error ===
              'you cant send to your own wallet address !!'
            ) {
              this.ownaddress = true;
              setTimeout(() => {
                this.ownaddress = false;
              }, 5000);
            }
            this.showSpinner = false;
            this.loadingButton = false;
          }
        );
      // }
    }
  }
  goToBuy() {
    if (this.gazcurrency?.toUpperCase() === 'BTT') {
      if (isPlatformBrowser(this.platformId))
        window.open(
          'https://sunswap.com/#/v2?lang=en-US&t0=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&t1=TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4&type=swap',
          '_blank'
        );
      return;
    }
    this.router.navigate(['/wallet/buy-token'], {
      queryParams: {
        gaz: this.gazcurrency
      }
    });
  }
  onClickAmount(): void {
    let currency = '';
    this.selectedCryptoSend = currency;
    
    if(!!this.selectedCryptoDetails && this.selectedCryptoDetails.quantity > 0) {
      if(
        this.selectedCryptoDetails.symbol === 'ETH' ||
        this.selectedCryptoDetails.symbol === 'BNB' ||
        this.selectedCryptoDetails.symbol === 'MATIC' ||
        this.selectedCryptoDetails.symbol === 'BTT' ||
        this.selectedCryptoDetails.symbol === 'TRX'
      ) {
        const fees = (this.selectedCryptoDetails.symbol === "BNB" ? this.bEPGaz : (
          this.selectedCryptoDetails.symbol === "ETH" ? this.eRC20Gaz : (
            this.selectedCryptoDetails.symbol === "MATIC" ? this.polygonGaz : (
              this.selectedCryptoDetails.symbol === "TRON" ? this.trxGaz : this.bttGaz
            )
          )
        ))
        const balance = this.selectedCryptoDetails?.total_balance.toFixed(2) - fees;
        const quantity = this.selectedCryptoDetails?.quantity - (fees / this.selectedCryptoDetails?.price) 
        if(balance > 0) {
          this.sendform.get('Amount')?.setValue(quantity)
          this.sendform.get('AmountUsd')?.setValue(balance)
          this.amount = this.showNumbersRule.transform(quantity.toString(), true);
          this.amountUsd = balance.toFixed(2)
          this.max = true;
        }
        

      } else {
        this.sendform.get('Amount')?.setValue(this.selectedCryptoDetails?.quantity)
        this.sendform.get('AmountUsd')?.setValue(this.selectedCryptoDetails?.total_balance.toFixed(2))
        this.amount = this.selectedCryptoDetails?.quantity
        this.amountUsd = this.selectedCryptoDetails?.total_balance.toFixed(2)
        this.max = true;
      }
    }
  }
  //validation send
  isValid(controlName: any) {
    return this.sendform.get(controlName)?.invalid;
  }

  //calculate gaz for erc20 and bep20
  parentFunction() {
    return this.walletFacade.getCryptoPriceList().pipe(
      map((response: any) => response.data),
      take(1),
      map((data: any) => {
        this.bnb = data['BNB'].price;
        this.eth = data['ETH'].price;
        this.matic = data['MATIC'].price;
        this.btt = data['BTT'].price;
        this.trx = data['TRX'].price;

        return {
          bnb: this.bnb,
          Eth: this.eth,
          matic: this.matic,
          btt: this.btt,
          trx: this.trx
        };
      }),
      switchMap(({ bnb, Eth, matic, btt, trx }) => {
        
        return forkJoin([
          this.walletFacade.getEtherGaz().pipe(
            take(1),
            tap((gaz: any) => {
              this.showSpinner = false;
              let price;
              price = gaz.data.gasPrice;
              this.gazsend = (
                ((price *(this.selectedCryptoSend !== 'ETH' ?65000:GazConsumed )) / 1000000000) *
                Eth
              ).toFixed(2);
              this.eRC20Gaz = this.gazsend;
            })
          ),
          this.walletFacade.getBnbGaz().pipe(
            take(1),
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
          ),
          this.walletFacade.getPolygonGaz().pipe(
            take(1),
            tap((gaz: any) => {
              this.showSpinner = false;
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
              this.showSpinner = false;
              let price;
              price = gaz.data.gasPrice;

              this.bttGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                btt
              ).toFixed(8);
            })
          ),
          this.walletFacade.getTrxGaz().pipe(
            take(1),
            tap((gaz: any) => {
              this.showSpinner = false;
              let price;
              price = gaz.data.gasPrice;

              this.trxGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                trx
              ).toFixed(8);
            })
          )
        ]);
      })
    );
  }

  /*------------------------ */

  restrictZero(event: any) {
    // [a,2,4,21].includes(event.key)
    if (
      event.keyCode === 59 ||
      event.keyCode === 16 ||
      [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97].includes(event.wich) ||
      (event.keyCode === 190 && event.shiftKey === true) ||
      event.keyCode === 190
    ) {
    } else if (
      !this.isValidKeyCode(event.keyCode) ||
      ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(event.keyCode) &&
        event.shiftKey === false &&
        event.key === !1)
    ) {
      event.preventDefault();
      this.convertcurrency('', false);
    } else {
    }
  }
  isValidKeyCode(code: number): boolean {
    return (
      (code >= 48 && code <= 57) ||
      (code >= 96 && code <= 105) ||
      code === 8 ||
      code === 46 ||
      code === 27 ||
      code === 110 ||
      code === 37 ||
      code === 39
    );
  }

  keyPressNumbersWithDecimal(event :any, type: string) {
    const inputValue = (event.target as HTMLInputElement).value;
    if (event.key === '.' && inputValue.includes('.')) {
      event.preventDefault();
    }
    if(type === 'crypto') {
      if((this.selectedCryptoDetails?.price * Number(inputValue)) > this.maxNumber) {
        event.preventDefault();
      }
    }
    if(type === 'usd' && Number(inputValue) > this.maxNumber) {
      event.preventDefault();
    }
    if ((event.which >= 48 && event.which <=57) || event.which === 46) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
    
  }

  convertcurrency(event: any, restrict?: boolean): void {
    this.max = false;
    let allow: boolean = true;
    if (restrict !== undefined && restrict === false) {
      allow = false;
    } else {
      allow = true;
    }
    if (allow) {

      var getamount: any = this.sendform.get('Amount')?.value;
      let getusd: any = this.sendform.get('AmountUsd')?.value;
      let sendamount = getamount?.toString();
      let sendusd = getusd?.toString();
      if(event === 'usd') {
        this.sendform.get('AmountUsd')?.setValue(sendusd);
        this.sendform.get('Amount')?.setValue(sendusd / this.selectedCryptoDetails.price)
        this.amount = this.showNumbersRule.transform((sendusd / this.selectedCryptoDetails.price).toString(), true)
        this.max = false;

    } else {
      this.sendform.get('Amount')?.setValue(sendamount);
      this.sendform.get('AmountUsd')?.setValue(sendusd * this.selectedCryptoDetails.price)
      this.amountUsd = this.showNumbersRule.transform((this.selectedCryptoDetails.price * sendamount).toString(), true);
      this.max = false;
      this.editwidthInput();
    }
    }
  }

  ngAfterViewChecked(): void {
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    if (elementinputusd)
    this.renderer.setStyle(elementinputusd,"width", elementinputusd.value.length + 1.2 + 'ch')
      //elementinputusd.style.width = elementinputusd.value.length + 1.2 + 'ch';
  }
  editwidthInput() {
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    //  elementinputusd.style.width = 40 + 'px';
    if (elementinputusd)
    this.renderer.setStyle(elementinputusd,"width", elementinputusd.value.length + 1.2 + 'ch')
      //elementinputusd.style.width = elementinputusd.value.length + 1.2 + 'ch';
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
    this.sendform
      .get('contact')
      ?.setValidators([Validators.required, Validators.pattern(pattContact)]);
    this.sendform.controls.currency.reset();
    this.sendform.controls.Amount.reset();
    this.sendform.controls.AmountUsd.reset();
    this.sendform.controls.password.reset();
    this.selectedCryptoDetails = event;
    // if(this.selectedCryptoDetails.symbol === "TRX"){
    // this.sendform.get('contact')?.setValidators(Validators.pattern(pattContact))
    // console.log("here");
    // this.patternType="^x0[a-fA-F0-9]{40}$"
    //  }
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
      //this.gazcurrency = 'ETH';
    } else if (this.networks === 'BEP20') {
      this.coinType = false;
      this.gazcurrency = 'BNB';
      // this.gazcurrency = 'BNB';
    } else if (this.networks === 'BTC') {
      this.coinType = true;
      this.gazcurrency = 'BTC';
      // this.gazcurrency = 'ETH';
    } else if (this.networks === 'POLYGON') {
      this.gazcurrency = 'MATIC';
      // this.gazcurrency = 'ETH';
    } else if (this.networks === 'BTTC') {
      this.gazcurrency = 'BTT';
      // this.gazcurrency = 'ETH';
    } else if (this.networks === 'TRON') {
      this.sendform
        .get('contact')
        ?.setValidators([
          Validators.required,
          Validators.pattern(tronPattContact)
        ]);
      this.gazcurrency = 'TRX';
      // this.gazcurrency = 'ETH';
    }
    setTimeout(() => {
      if (this.networks === 'ERC20' || this.networks === 'BTC') {
        this.gazsend = this.eRC20Gaz;
      }

      if (this.networks === 'BEP20') {
        this.gazsend = this.bEPGaz;
      }
      if (this.networks === 'POLYGON') {
        this.gazsend = this.polygonGaz;
      }
      if (this.networks === 'BTTC') {
        this.gazsend = this.bttGaz;
      }
      if (this.networks === 'TRON') {
        this.gazsend = this.trxGaz;
      }
    }, 2000);

    if (this.dataList.length) {
      this.dataList?.forEach((crypto: any) => {
        if (this.networks === 'ERC20' || this.networks === 'BTC') {
          this.gazsend = this.eRC20Gaz;
          if (crypto.symbol === 'ETH') {
            this.gasCryptoQuantity = (this.gazsend / crypto.price).toFixed(8);
          }
        }
        if (this.networks === 'BEP20') {
          this.gazsend = this.bEPGaz;
          if (crypto.symbol === 'BNB') {
            this.gasCryptoQuantity = (this.gazsend / crypto.price).toFixed(8);
          }
        }
        if (this.networks === 'POLYGON') {
          this.gazsend = this.polygonGaz;
          if (crypto.symbol === 'MATIC') {
            this.gasCryptoQuantity = (this.gazsend / crypto.price).toFixed(8);
          }
        }
        if (this.networks === 'BTTC') {
          this.gazsend = this.bttGaz;
          if (crypto.symbol === 'BTT') {
            this.gasCryptoQuantity = (this.gazsend / crypto.price).toFixed(8);
          }
        }
        if (this.networks === 'TRON') {
          //TODO
          this.sendform
            .get('contact')
            ?.setValidators([
              Validators.required,
              Validators.pattern(tronPattContact)
            ]);
          this.gazsend = this.trxGaz;
          if (crypto.symbol === 'TRX') {
            this.gasCryptoQuantity = (this.gazsend / crypto.price).toFixed(8);
          }
        }
      });
    } else {
      this.parentFunction().subscribe(() => {
        this.activeRoute.queryParams.subscribe((selectedCrypto: any) => {
          if (
            selectedCrypto.network === 'ERC20' ||
            selectedCrypto.network === 'BTC'
          ) {
            this.gazsend = this.eRC20Gaz;
            if (selectedCrypto.id === 'ETH') {
              this.gasCryptoQuantity = (this.gazsend / this.eth).toFixed(8);
            }

            if (selectedCrypto.sendTo) {
              this.onClickAmount();
              this.contactWallet = selectedCrypto.sendTo;
            }
          }
          if (selectedCrypto.network === 'BEP20') {
            this.gazsend = this.bEPGaz;
            if (selectedCrypto.id === 'BNB') {
              this.gasCryptoQuantity = (this.gazsend / this.bnb).toFixed(8);
            }
            if (selectedCrypto.sendTo) {
              this.onClickAmount();
              this.contactWallet = selectedCrypto.sendTo;
            }
          }
          if (selectedCrypto.network === 'POLYGON') {
            this.gazsend = this.polygonGaz;
            if (selectedCrypto.id === 'MATIC') {
              this.gasCryptoQuantity = (this.gazsend / this.matic).toFixed(8);
            }
            if (selectedCrypto.sendTo) {
              this.onClickAmount();
              this.contactWallet = selectedCrypto.sendTo;
            }
          }
          if (selectedCrypto.network === 'BTTC') {
            this.gazsend = this.bttGaz;
            if (selectedCrypto.id === 'BTT') {
              this.gasCryptoQuantity = (this.gazsend / this.btt).toFixed(8);
            }
            if (selectedCrypto.sendTo) {
              this.onClickAmount();
              this.contactWallet = selectedCrypto.sendTo;
            }
          }
          if (selectedCrypto.network === 'TRON') {
            //TODO
            this.sendform
              .get('contact')
              ?.setValidators([
                Validators.required,
                Validators.pattern(tronPattContact)
              ]);
            this.gazsend = this.trxGaz;
            if (selectedCrypto.network === 'TRON') {
              this.gasCryptoQuantity = (this.gazsend / this.trx).toFixed(8);
            }
            if (selectedCrypto.sendTo) {
              this.onClickAmount();
              this.contactWallet = selectedCrypto.sendTo;
            }
          }
        });
      });
    }
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
    this.linstingCrypto(this.selectedCryptoDetails);
    this.walletFacade.cryptoList$.subscribe((res) => {
      this.cryptoToDropdown = res.filter(
        (elem) => elem.symbol === this.selectedCryptoDetails.symbol
      )[0];
    });
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
    if (isPlatformBrowser(this.platformId) && window.innerWidth <= 768) {
      const classElement = this.document.getElementsByClassName(id);
      if (classElement.length > 0) {
        classElement[0].scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
