import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  Inject,
  Renderer2
} from '@angular/core';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
import { GazConsumedByCampaign, ListTokens } from '@config/atn.config';
import { SidebarService } from '@core/services/sidebar/sidebar.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {
  catchError,
  filter,
  map,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { forkJoin, of, Subject } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { Big } from 'big.js';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss']
})
export class ConvertComponent implements OnInit, OnDestroy {
  idWallet = this.tokenStorageService.getIdWallet();
  cryptoData: any = [];
  dropDownSection: any = [];
  arrow: string = '';
  arrowColor: string = '';
  typetab: string = '';
  hideBalance: boolean = false;
  portfeuilleList: Array<{ type: any; code: any }> = [];
  showSelectedValue: boolean = false;
  portfeuilleCode: string = '';
  portfeuilleType: string = '';
  btcCode: string = '';
  erc20: string = '';
  selectedValue: any;
  totalAmount: any;
  show: boolean = true;
  show2: boolean = true;
  cryptoName: string = 'SATT';
  cryptoPicName: string = 'SATT';
  cryptoQuantity: string = '';
  cryptoSymbol: string = 'SATT';
  cryptoPicNameconvert: string = 'SATT';
  cryptoSymbolconvert: string = '';
  checkType: string = 'ERC20';
  convertform: UntypedFormGroup;
  amountdefault: any;
  selectedCryptoSend: any;
  noCryptoSelected: boolean = false;
  loading: boolean = false;
  showButtonSend: boolean = true;
  showButtonReceive: boolean = true;
  loadingButtonReceive!: boolean;
  isSubmitting!: boolean;
  showSpinner!: boolean;
  loadingButton!: boolean;
  balanceNotEnough: boolean = false;
  wrongpassword: boolean = false;
  notEnoughtBalance: boolean = false;
  gazproblem: boolean = false;
  hashtransaction: string = '';
  amountUsd: any;
  amount: any;
  selectedCrypto: any = 'SATT';
  quantityERC20: any;
  quantityBEP20: any;
  quantityBTC: any;
  gazsend: any;
  dataList: any[] = [];
  liClicked: boolean = false;
  bEPGaz: any;
  currency: any;
  bnb: any;
  eth: any;
  eRC20Gaz: any;
  isSubmittingReceive!: boolean;
  currentUser: any;
  emailNotCorrect!: boolean;
  showCryptoliste: boolean = true;
  showimageup: boolean = true;
  showimagedown: boolean = true;
  showimageupdisable: boolean = false;
  showimagedowndisable: boolean = false;
  showimageupquantity: boolean = true;
  showimagedownquantity: boolean = true;
  showimageupdisablequantity: boolean = false;
  showimagedowndisablequantity: boolean = false;
  showimageuptotal: boolean = true;
  showimagedowntotal: boolean = true;
  showimageupdisabletotal: boolean = false;
  showimagedowndisabletotal: boolean = false;
  showSend: boolean = false;
  showSendfailed: boolean = false;
  showConvertfailed: boolean = false;
  showConvertir: boolean = false;
  showReceive: boolean = false;
  showSendSuccess: boolean = false;
  showReceiveSuccess: boolean = false;
  showConvertSuccess: boolean = false;
  defaultcurrency: any;
  defaultcurr: string = ListTokens['SATT'].name;
  defaultcurrbep: any;
  defaultcurrbtc: any;
  receivingNotif: any = null;
  etherInWei = new Big(1000000000000000000);
  datalist: any;
  isBitcoinAdress: boolean = false;
  isERC20Adress: boolean = false;
  showNoFailures: any;
  failureFilter: any;
  cryptoStorage: any;
  nobalance: boolean = false;
  convertblock: boolean = true;
  search: any;
  @ViewChild('inputAmount') inputAmount?: ElementRef;
  @ViewChild('inputAmountUsd') inputAmountUsd?: ElementRef;
  @ViewChild('inputAmountReceive') inputAmountReceive?: ElementRef | undefined;
  @ViewChild('inputAmountReceiveUsd') inputAmountReceiveUsd?:
    | ElementRef
    | undefined;
  @ViewChild('checkUserLegalKYCModal') checkUserLegalKYCModal!: ElementRef;
  @ViewChild('inputAmountConvert') inputAmountConvert?: ElementRef;
  @ViewChild('hidedAmountValue') hidedAmountValue?: ElementRef;
  @ViewChild('amountEditable') amountEditable?: ElementRef;
  @ViewChild('amountUsdEditable') amountUsdEditable?: ElementRef;

  listecrypto: any;
  quantitecrypto: any;
  currencyList: any;
  cryptoList: any = [];
  convertdata: any;
  newtab: any = [];
  direction: any;
  newquantity: any;
  difference: any;
  paramsSubscription: any;
  showBigSpinner: boolean = false;
  showWalletSpinner: boolean = true;
  coinType: boolean = false;
  gazsendether: any;
  gazcurrency: any;
  network: string = '';
  delete: any;
  routeEventSubscription: any;
  networks: any;
  decimals: any;
  token: any;
  symbol: any;
  totalBalance$ = this.walletFacade.totalBalance$;
  cryptoList$ = this.walletFacade.cryptoList$;
  txtValue: string = '';
  searched: boolean = false;
  converttype: any;
  quantitysatt: any;
  private onDestoy$ = new Subject();
  private account$ = this.accountFacadeService.account$;
  matic: any;
  polygonGaz: any;
  constructor(
    private accountFacadeService: AccountFacadeService,
    private Fetchservice: CryptofetchServiceService,
    public sidebarService: SidebarService,
    public modalService: NgbModal,
    public translate: TranslateService,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private tokenStorageService: TokenStorageService,
    private walletFacade: WalletFacadeService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.convertform = new UntypedFormGroup({
      Amount: new UntypedFormControl(
        null,
        Validators.compose([Validators.required, Validators.min(0)])
      ),
      AmountUsd: new UntypedFormControl(
        null,
        Validators.compose([Validators.min(0)])
      ),
      password: new UntypedFormControl(null, Validators.required),
      currency: new UntypedFormControl(null)
    });
  }

  ngOnDestroy(): void {
    if (!!this.routeEventSubscription) {
      this.routeEventSubscription.unsubscribe();
    }
    this.onDestoy$.next('');
    this.onDestoy$.complete();
  }

  ngOnInit(): void {
    this.initiateState();
    this.getusercrypto();

    this.cryptoList$
      .pipe(
        filter((data) => data.length !== 0),
        takeUntil(this.onDestoy$)
      )
      .subscribe((data: any) => {
        this.dataList = data;
      });
    this.showconvertir(event);
  }

  //display all address for user
  portfeuille() {
    this.walletFacade.wallet$
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((data: any) => {
        this.btcCode = data.data.btc;
        this.erc20 = data.data.address;
        this.portfeuilleList = [
          { type: 'ERC20/BEP20', code: this.erc20 },
          { type: 'BTC', code: this.btcCode }
        ];
      });
  }

  getProfileDetails() {
    this.showSpinner = true;
    this.account$
      .pipe(
        filter((res) => res !== null),

        takeUntil(this.onDestoy$)
      )

      .subscribe((data) => {
        this.showSpinner = false;
        this.currentUser = data;
      });
  }
  editwidthInput() {
    let elementinput = this.inputAmount?.nativeElement;
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    let elementinputreceive = this.inputAmountReceive?.nativeElement;
    let elementinputreceiveusd = this.inputAmountReceiveUsd?.nativeElement;
    let elementinputconvert = this.inputAmountConvert?.nativeElement;

    if (elementinput)
      this.renderer.setStyle(
        elementinput,
        'width',
        elementinput.value.length + 'ch'
      );
    //elementinput.style.width = elementinput.value.length + 'ch';
    if (elementinputusd)
      this.renderer.setStyle(
        elementinputusd,
        'width',
        elementinputusd.value.length + 'ch'
      );
    //elementinputusd.style.width = elementinputusd.value.length + 'ch';
    if (elementinputreceive)
      elementinputreceive.style.width = elementinputreceive.value.length + 'ch';
    if (elementinputreceiveusd)
      elementinputreceiveusd.style.width =
        elementinputreceiveusd.value.length + 'ch';
    if (elementinputconvert)
      elementinputconvert.style.width = elementinputconvert.value.length + 'ch';
  }

  //convert dropdown
  showconvertir(event: any) {
    this.Fetchservice.coinToConvertType = event.target.id;
    if (event.target.id === 'SATTBEP20') {
      this.checkType = 'BEP20';
      // this.amountdefault = event.target.id;
      this.converttype = 'bep20';
      this.defaultcurr = ListTokens['SATTBEP20'].name;
      this.convertform.get('currency')?.setValue(this.defaultcurr);
      this.amountdefault = this.convertform.get('currency')?.value;
      this.currency = event.target.id;
      this.selectedCryptoSend = this.currency;
      this.direction = 'BTE';
      this.cryptoSymbolconvert = event.target.id;
      this.cryptoPicNameconvert = 'SATT';
      this.cryptoSymbol = 'SATT';
      this.cryptoPicName = 'SATT';
      this.dataList?.forEach((crypto: any) => {
        if (crypto.symbol === 'SATTBEP20') {
          this.quantityBEP20 = crypto.quantity;
        }
        if (crypto.symbol === 'SATT') {
          this.quantitysatt = crypto.quantity;
        }
      });
    }
    if (event.target.id === 'SATT') {
      this.checkType = 'ERC20';
      this.converttype = 'erc20';

      this.amountdefault = event.target.id;

      this.defaultcurr = ListTokens['SATT'].name;

      this.convertform.get('currency')?.setValue(this.defaultcurr);
      this.amountdefault = this.convertform.get('currency')?.value;
      this.currency = event.target.id;

      this.selectedCryptoSend = this.currency;

      this.direction = 'ETB';

      // this.newtab = this.convertdata.slice(1, 3);
      this.cryptoSymbol = 'SATTBEP20';
      this.cryptoPicName = 'SATT';
      this.cryptoSymbolconvert = event.target.id;
      this.cryptoPicNameconvert = 'SATT';
      this.dataList?.forEach((crypto: any) => {
        if (crypto.symbol === 'SATTBEP20') {
          this.quantityBEP20 = crypto.quantity;
        }
        if (crypto.symbol === 'SATT') {
          this.cryptoQuantity = crypto.quantity;
        }
      });
    }
  }
  showconvertirDialog(coinType: string) {
    this.initiateState();

    if (coinType === 'SATTBEP20') {
      // this.amountdefault = event.target.id;
      this.defaultcurr = ListTokens['SATTBEP20'].name;
      this.convertform.get('currency')?.setValue(this.defaultcurr);
      this.amountdefault = this.convertform.get('currency')?.value;
      this.currency = coinType;
      this.selectedCryptoSend = this.currency;
      this.direction = 'BTE';
      this.cryptoSymbolconvert = coinType;
      this.cryptoPicNameconvert = 'SATT';
      this.cryptoSymbol = 'SATT';
      this.cryptoPicName = 'SATT';
    }
    if (coinType === 'SATT') {
      this.amountdefault = coinType;
      this.defaultcurr = ListTokens['SATT'].name;

      this.convertform.get('currency')?.setValue(this.defaultcurr);
      this.amountdefault = this.convertform.get('currency')?.value;
      this.currency = coinType;

      this.selectedCryptoSend = this.currency;

      this.direction = 'ETB';

      // this.newtab = this.convertdata.slice(1, 3);
      this.cryptoSymbol = 'SATTBEP20';
      this.cryptoPicName = 'SATT';
      this.cryptoSymbolconvert = coinType;
      this.cryptoPicNameconvert = 'SATT';
    }
    this.showCryptoliste = false;
    this.showConvertir = true;
  }

  //convert function
  convert() {
    //let token: any;
    if (this.convertform.valid) {
      this.showSpinner = true;
      this.loading = true;
      this.showButtonSend = false;
      // let direction = this.direction;
      this.loadingButton = true;
      let splitted: any = this.convertform.get('Amount')?.value;
      this.resetchecker();
      // const token = this.tokenStorageService.getToken();
      const amountdecimal = splitted.toString();
      let amount = splitted.toString();

      let currency = '';
      const password = this.convertform.get('password')?.value;

      //token=ListTokens[currency].contract
      amount = new Big(amountdecimal)
        .times(ListTokens[this.defaultcurr].decimals)
        .toFixed(30)
        .split('.')[0];
      const send: any = { amount: amount, pass: password };
      this.convertform.get('password')?.reset();
      if (this.direction === 'BTE') {
        this.Fetchservice.convertcrypto(send)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              if (
                error.error.error ===
                'Key derivation failed - possibly wrong password'
              ) {
                this.showConvertfailed = false;
                this.showConvertSuccess = false;
                this.convertblock = true;
                this.wrongpassword = true;
                this.show = !this.show;
                this.show2 = !this.show2;
                setTimeout(() => {
                  this.wrongpassword = false;
                }, 5000);
                let elementinputconvert =
                  this.inputAmountConvert?.nativeElement;
                elementinputconvert.style.width = 23 + 'px';
              } else if (error.error.error === 'insufficient funds for gas') {
                this.showConvertfailed = true;
                this.showConvertSuccess = false;
                this.convertblock = false;

                this.wrongpassword = false;
                this.showButtonSend = true;
                this.gazproblem = true;
                setTimeout(() => {
                  this.gazproblem = false;
                }, 5000);
                let elementinputconvert =
                  this.inputAmountConvert?.nativeElement;
                elementinputconvert.style.width = 23 + 'px';
              } else if (error.error.error === 'not_enough_budget') {
                this.showConvertfailed = false;
                this.showConvertSuccess = false;
                this.convertblock = true;
                this.notEnoughtBalance = true;
                this.show = !this.show;
                this.show2 = !this.show2;
                setTimeout(() => {
                  this.notEnoughtBalance = false;
                }, 5000);
              }
              return of(false);
            }),
            takeUntil(this.onDestoy$)
          )
          .subscribe(
            (data: any) => {
              this.showButtonSend = true;
              this.loadingButton = false;
              if (data.transactionHash) {
                this.amount = splitted;
                this.currency = currency;
                this.hashtransaction = data.transactionHash;
                this.showConvertSuccess = true;
                this.convertblock = false;
                this.showConvertfailed = false;
                this.notEnoughtBalance = false;
              }
              // else if (data.error === 'Wrong password') {
              //   this.showConvertfailed = false;
              //   this.showConvertSuccess = false;
              //   this.convertblock = true;
              //   this.wrongpassword = true;
              //   this.show = !this.show;
              //   this.show2 = !this.show2;
              //   setTimeout(() => {
              //     this.wrongpassword = false;
              //   }, 5000);

              //   let elementinputconvert = this.inputAmountConvert?.nativeElement;
              //   // let elementinputconvertusd = this.inputAmountConvertUsd?.nativeElement;
              //   elementinputconvert.style.width = 23 + 'px';
              //   //  elementinputconvertusd.style.width = 40 + "px";
              // }
              // else if (data.error) {
              //   this.showConvertfailed = true;
              //   this.showConvertSuccess = false;
              //   this.convertblock = false;

              //   this.wrongpassword = false;
              //   this.showButtonSend = true;
              //   this.gazproblem = true;
              //   setTimeout(() => {
              //     this.gazproblem = false;
              //   }, 5000);
              //   let elementinputconvert = this.inputAmountConvert?.nativeElement;
              //   // let elementinputconvertusd = this.inputAmountConvertUsd?.nativeElement;
              //   elementinputconvert.style.width = 23 + 'px';
              //   //  elementinputconvertusd.style.width = 40 + "px";
              // } else {
              //   this.showConvertfailed = false;
              //   this.showConvertSuccess = false;
              //   this.convertblock = true;
              //   this.notEnoughtBalance = true;
              //   this.show = !this.show;
              //   this.show2 = !this.show2;
              //   setTimeout(() => {
              //     this.notEnoughtBalance = false;
              //   }, 5000);
              // }
            },

            () => {
              this.showSpinner = false;
              this.showButtonSend = true;
              this.loadingButton = false;
            }
          );
      }
    }
  }

  otherConvert() {
    this.show = !this.show;
    this.show2 = !this.show2;
    this.showConvertir = true;
    this.showConvertSuccess = false;
    this.showConvertfailed = false;

    this.cryptoSymbol = this.defaultcurr;
    this.cryptoName = this.defaultcurr;
    this.cryptoPicName = this.defaultcurr;

    let elementinput = this.inputAmount?.nativeElement;
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    let elementinputreceive = this.inputAmountReceive?.nativeElement;
    let elementinputreceiveusd = this.inputAmountReceiveUsd?.nativeElement;
    let elementinputconvert = this.inputAmountConvert?.nativeElement;
    //  let elementinputconvertusd = this.inputAmountConvertUsd?.nativeElement;

    elementinput.style.width = 23 + 'px';
    elementinputusd.style.width = 40 + 'px';
    elementinputreceive.style.width = 23 + 'px';
    elementinputreceiveusd.style.width = 40 + 'px';
    elementinputconvert.style.width = 23 + 'px';
    //elementinputconvertusd.style.width = 40 + "px";

    this.checkType = 'ERC20';
  }

  resetchecker() {
    this.balanceNotEnough = false;
    this.wrongpassword = false;
    this.gazproblem = false;
    this.noCryptoSelected = false;
  }

  maxconvert(): void {
    let currencyconvert = '';
    this.selectedCryptoSend = currencyconvert;
    if (this.selectedCryptoSend) {
      currencyconvert = this.selectedCryptoSend;
    } else {
      currencyconvert = this.convertform.get('currency')?.value;
    }
    if (currencyconvert) {
      this.dataList?.forEach((crypto: any) => {
        if (crypto.symbol === currencyconvert) {
          this.convertform.get('Amount')?.setValue(crypto.quantity),
            this.convertform.get('AmountUsd')?.setValue(crypto.total_balance);
        }
        this.editwidthInput();
      });
    }
  }
  //convert currency to usd
  convertcurrency(event: any): void {
    let currency = '';
    let currencyreceive = '';
    let currencyconvert = '';
    var getamountconvert: any = this.convertform.get('Amount')?.value;
    let getusdconvert: any = this.convertform.get('AmountUsd')?.value;

    let convertamount = getamountconvert?.toString();
    let convertusd = getusdconvert?.toString();

    this.selectedCryptoSend = currency;

    if (this.selectedCryptoSend) {
      currency = this.selectedCryptoSend;
      currencyreceive = this.selectedCryptoSend;
      currencyconvert = this.defaultcurr;
    } else {
      currencyreceive = this.amountdefault;
      currencyconvert = this.defaultcurr;
    }
    this.dataList?.forEach((crypto: any) => {
      if (event === 'amount') {
        if (crypto.symbol === currency) {
        }
      }
      if (event === 'amountreceive') {
        if (crypto.symbol === currencyreceive) {
        }
      }
      if (event === 'amountconvert') {
        if (crypto.symbol === currencyconvert) {
          this.amountUsd = (crypto.price * convertamount).toFixed(2);
        }
      }
      if (event === 'usd') {
        if (crypto.symbol === currency) {
        }
      }
      if (event === 'usdreceive') {
        if (crypto.symbol === currencyreceive) {
        }
      }
      if (event === 'usdconvert') {
        if (crypto.symbol === currencyconvert) {
          this.amount = (convertusd / crypto.price).toFixed(8);
        }
      }
    });
  }
  selectValueconvert(name: string, picName: string, symbol: string) {
    let elementinput = this.inputAmount?.nativeElement;
    elementinput.style.width = elementinput.value.length + 0.5 + 'ch';
    let elementinputreceive = this.inputAmountReceive?.nativeElement;
    elementinputreceive.style.width =
      elementinputreceive.value.length + 0.5 + 'ch';
    this.cryptoName = name;
    this.cryptoPicName = picName;

    this.cryptoSymbol = symbol;
  }

  //validation convert
  isValidconvert(controlName: any) {
    return this.convertform.get(controlName)?.invalid;
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

  //get list of crypto for user
  getusercrypto() {
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
        takeUntil(this.onDestoy$)
      )
      .subscribe((data: any) => {
        this.walletFacade.hideWalletSpinner();
        this.showWalletSpinner = false;
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

        // if ((this.dataList.total_balance = "0")) {
        //   this.dataList.total_balance = "0.00";
        // }
        this.dataList?.forEach((crypto: any) => {
          // console.log('netwrook',crypto)
          crypto.price = this.filterAmount(crypto.price + '');
          crypto.variation = parseFloat(crypto.variation + '');
          var cryptoVariations = crypto?.variation?.toFixed(8) ?? '0';

          crypto.variation = !!crypto.variation
            ? crypto?.variation?.toFixed(2)
            : '0.00';
          crypto.quantity = this.filterAmount(crypto.quantity + '');
          crypto.total_balance = parseFloat(crypto.total_balance + '');
          crypto.total_balance = crypto?.total_balance?.toFixed(2);
          crypto.affectPercent = (
            (crypto.total_balance * 100) /
            this.totalAmount
          ).toFixed(2);
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
          if (cryptoVariations < 0) {
            crypto.arrow = '';
            crypto.arrowColor = 'red';
          } else {
            crypto.arrow = '+';
            crypto.arrowColor = 'green';
          }
          if (crypto.quantity.startsWith('-')) {
            crypto.quantity = '0.00000000';
          }

          if (crypto.symbol === 'SATT') {
            this.quantityERC20 = crypto.quantity;
          }
        });
        this.dataList?.forEach((crypto: any) => {
          if (crypto.symbol === 'SATTBEP20') {
            this.quantityBEP20 = crypto.quantity;
          }
          if (crypto.symbol === 'SATT') {
            this.quantityERC20 = crypto.quantity;
          }
        });

        this.cryptoStorage = this.cryptoList.slice();
        this.convertdata = this.cryptoList;
        this.newtab = this.convertdata.slice(0, 0);

        let divCrypto = this.document.getElementById('cryptoList');
        if (divCrypto) {
          divCrypto.style.height = 'auto';
        }
        this.spinner.hide('showWalletSpinner');
        this.showWalletSpinner = false;
      });
  }
  //calculate gaz for erc20 and bep20
  parentFunction() {
    return this.walletFacade.getCryptoPriceList().pipe(
      map((response: any) => response.data),
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
          ),
          this.walletFacade.getPolygonGaz().pipe(
            tap((gaz: any) => {
              this.showSpinner = false;
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

  //receive crypto

  initiateState() {
    this.parentFunction().pipe(takeUntil(this.onDestoy$)).subscribe();
    this.getProfileDetails();
    this.portfeuille();
    this.defaultcurr = ListTokens['SATT'].name;
    this.defaultcurrbep = ListTokens['SATTBEP20'].name;
    this.defaultcurrbtc = ListTokens['BTC'].name;
  }
  trackByCrypto(index: number, crypto: any): string {
    return crypto.code;
  }
}
