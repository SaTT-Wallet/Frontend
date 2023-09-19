import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnChanges,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { environment } from '@environments/environment';
import { cryptoNetwork, dataList, pattContact } from '@config/atn.config';
import { cryptoList, ListTokens } from '@config/atn.config';
import { Observable, of, Subject, zip } from 'rxjs';
import {
  filter,
  tap,
  map,
  takeUntil,
  catchError,
  switchMap
} from 'rxjs/operators';
import { Location } from '@angular/common';

import * as _ from 'lodash';
import { Console } from 'console';
import { TranslateService } from '@ngx-translate/core';

enum EBlockchainNetwork {
  ERC20 = 'ERC20',
  BEP20 = 'BEP20',
  BTC = 'BTC',
  POLYGON = 'POLYGON',
  TRON = 'TRON',
  SATTBEP20='SATTBEP20',
  FIAT = 'fiat',
}
let {WSATT,...cryptoData} = ListTokens
enum ECurrencyType {
  FIAT = 'fiat',
  BEP20 = 'bep20',
  ERC20 = 'erc20',
  TRON= 'tron'
}

type Crypto = {
  name: string;
  contract: string;
  decimals: string;
  logo: string;
  type: string;
  symbole: string;
};

type CryptoListItem = {
  AddedToken: boolean;
  contract: string;
  decimal: number;
  name: string;
  network: string;
  picUrl: boolean;
  price: number;
  quantity: number;
  symbol: string;
  total_balance: number;
  undername: string;
  undername2: string;
  variation: number;
};
@Component({
  selector: 'app-buy-token',
  templateUrl: './buy-token.component.html',
  styleUrls: ['./buy-token.component.scss']
})
export class BuyTokenComponent implements OnInit, OnChanges {
  liClicked!: boolean;
  amount: number = 50;
  currency: any;
  convertform: UntypedFormGroup;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cryptoMoneyList: any[] = dataList;
  selectedLevel: any;
  selectedGenderValue: any;
  selectedCurrencyValue = 'USD';
  selectedtLogo = '$';
  cryptoList: Crypto[] = _.values(cryptoData) as Crypto[];
  requestedCrypto = 'SATT';
  fiatCurrency = 'USD';
  fiatLogo = 'SATTBEP20.svg';
  cryptoAmount = 0;
  errMsg = '';
  errorMsg = '';
  quoteId: any;
  points: any[] = [];
  cryptoList$ = this.walletFacade.getCryptoPriceList().pipe(
    map((cryptoPrices: any) => {
      let arr: CryptoListItem[] = [];

      for (let key in cryptoPrices.data) {
        arr.push({
          symbol: key,
          ...cryptoPrices.data[key]
        });
      }

      return arr;
    })
  );
  ethPrice: any;
  cryptoPrice = 0;
  gaz: any;

  private isDestroyed = new Subject<any>();

  isDestroyedObs = this.isDestroyed.asObservable();

  position: any;
  walletId: any = this.tokenStorageService.getIdWallet()
    ? this.tokenStorageService.getIdWallet()
    : '';
  walletBtc: any;

  isConnected: boolean = false;
  sattprice = 0;
  routerSub: any;
  isCryptoRouter: boolean = false;
  eBlockchainNetwork = EBlockchainNetwork;
  eCurrencyType = ECurrencyType;
  selectedBlockchainNetwork = EBlockchainNetwork.BEP20;
  selectedCurrencyType = ECurrencyType.FIAT; 
  selectedTargetCurrency = 'SATT (BEP20)';
  targetCurrencyList: ({ value: string; symbol: string } | Crypto)[] = [];
  sourceCryptoList: Crypto[] = [];
  requestedCryptoPriceInUSD$ = new Observable<number>();
  purshaseCryptoPriceInUSD$ = new Observable<number>();
  rateExchangePerRequestedCrypto$ = new Observable<number>();
  showSpinner = false;
  toSwapCrypto: any;
  fromSwapCrypto: any;
  quoteIdParams: boolean = false;
  inputAmount$ = new Subject();
  maxAmountNumber: number = 9999999999999;
  EBlockchainNetwork: any;

  constructor(
    private walletFacade: WalletFacadeService,
    public router: Router,
    public route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private tokenStorageService: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: string,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService
  ) {
    this.convertform = new UntypedFormGroup({
      Amount: new UntypedFormControl(
        0,
        Validators.compose([Validators.required, Validators.min(0)])
      ),
      currency: new UntypedFormControl(this.selectedCurrencyValue),
      walletId: new UntypedFormControl(this.walletId, {
        validators: [Validators.required, Validators.pattern(pattContact)]
      })
    });
  }

  ngOnInit(): void {
    this.walletBtc = this.tokenStorageService.getWalletBtc();

    this.listenToInputAmountChange();
    // this.toggleCurrencyType(ECurrencyType.FIAT);
    // this.toggleNetwork(EBlockchainNetwork.BEP20);
    this.gaz = this.activatedRoute.snapshot.queryParamMap.get('gaz');

    // if (this.gaz === 'ERC20') {
    //   this.toggleNetwork(EBlockchainNetwork.ERC20);
    // }
    this.routerSub = this.route.queryParams
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((p: any) => {
        if (!p.quote_id) {
          this.quoteIdParams = false;
        } else {
          this.quoteIdParams = true;
        }
        if (p.id) {

          // this.toggleCurrencyType(ECurrencyType.FIAT);
          // this.toggleNetwork(p.network);
          this.selectedCurrencyType = p.currency;
          this.isCryptoRouter = true;
          this.requestedCrypto = p.id;
          this.initToggleCurrencyType(ECurrencyType.FIAT);
          this.initToggleNetwork(p.network);

          if (p.id === 'SATT-SC') {
            this.fiatLogo = 'SATTBEP20.svg';
          } else if (p.id === 'SATT-ERC20') {
            this.fiatLogo = 'SATT2.svg';
          } else if (p.id === EBlockchainNetwork.SATTBEP20) {
            this.selectedCurrencyLogo === EBlockchainNetwork.SATTBEP20;
          } else if (p.id === EBlockchainNetwork.TRON) {
            this.selectedCurrencyLogo === EBlockchainNetwork.SATTBEP20;}else {
            this.fiatLogo = p.id + '.svg';
            this.requestedCrypto = p.id;
          }
        } else if (p.amount) {
          this.toggleCurrencyType(p.fiatCurrency);
          this.toggleNetwork(p.network);
          // this.selectedCurrencyType = p.currency;
          if (p.crypto === 'SATT-SC') {
            this.fiatLogo = 'SATTBEP20.svg';
          } else if (p.crypto === 'SATT-ERC20') {
            this.fiatLogo = 'SATT2.svg';
          }  else {
            this.fiatLogo = p.id + '.svg';
          }
          this.isCryptoRouter = true;
          this.amount = p.amount;
          this.selectedCurrencyValue = p.currency;
          this.fiatCurrency = p.currency;
          // this.fiatLogo = p.crypto + '.svg';
          this.requestedCrypto = p.crypto;
          this.cryptoAmount = p.cryptoAmount;
          this.quoteId = p.quote_id;
          this.selectedtLogo = p.symbol;
          this.walletId = p.wallet;
          this.selectedTargetCurrency = p.currency;
        } else if (p.gaz === 'ETH') {
          this.toggleCurrencyType(ECurrencyType.FIAT);

          this.toggleNetwork(EBlockchainNetwork.ERC20);
          this.requestedCrypto = 'ETH';
        } else if (p.gaz === 'BNB') {
          this.toggleCurrencyType(ECurrencyType.FIAT);
          this.toggleNetwork(EBlockchainNetwork.BEP20);
          this.requestedCrypto = 'BNB';
          // this.selectedTargetCurrency = 'SATT';
          
        }
       
       else {
          this.toggleCurrencyType(ECurrencyType.FIAT);
          this.toggleNetwork(EBlockchainNetwork.BEP20);
        //  this.toggleNetwork(EBlockchainNetwork.TRON);
        }
      });

    this.convertCryptoUnitToUSD();
    if (!this.quoteIdParams) {
      this.convertCrypto();
    }
    this.listenToPressKeyOnCurrencySelect();

    if (this.tokenStorageService.getToken()) {
      this.isConnected = true;
    } else {
      this.isConnected = false;
    }
    this.cryptoMoneyList = this.cryptoMoneyList.sort((a, b) => {
      if (a.value > b.value) {
        return 1;
      }
      if (b.value > a.value) {
        return -1;
      }
      return 0;
    });
  }
  ngOnChanges(): void {
    this.convertform
      .get('Amount')
      ?.valueChanges.pipe(takeUntil(this.isDestroyed))
      .subscribe((data: any) => {
        this.amount = data;

        this.convertCrypto();
      });
  }

  shouldApplyFromWalletClass(): boolean {
    const path = this.getPath()?.toString() || '';
    const storageInfo = this.getStorageInformation();
    return path.includes('buy-token') && storageInfo !== 'false';
  }
  getStorageInformation() {
    return window.localStorage.getItem('phishing');
  }
  getPath() {
    return window.location.pathname;
  }
  redirect() {
    if (!this.isConnected) {
      this.router.navigate(['auth/login']);
    }
  }
  toggleNetwork(network: EBlockchainNetwork) {
    this.selectedBlockchainNetwork = network;
    if (network === EBlockchainNetwork.BTC) {
      this.sourceCryptoList = cryptoList
        .map((crypto: { symbol: string; network: string; logo: string }) => {
          return {
            name: crypto.symbol,
            contract: '',
            decimals: '0',
            logo: crypto.logo,
            type: crypto.network,
            symbole: crypto.symbol
          } as Crypto;
        })
        .filter((crypto: Crypto) => crypto.type.toUpperCase() === network);
      this.requestedCrypto = this.sourceCryptoList.find(
        (crypto: Crypto) =>
          crypto.type.toUpperCase() === this.selectedBlockchainNetwork
      )?.symbole as string;
    } else if (this.selectedCurrencyType === ECurrencyType.FIAT) {
      this.sourceCryptoList = cryptoList
        .map((crypto: { symbol: string; network: string; logo: string }) => {
          return {
            name: crypto.symbol,
            contract: '',
            decimals: '0',
            logo: crypto.logo,
            type: crypto.network,
            symbole: crypto.symbol
          } as Crypto;
        })
        .filter((crypto: Crypto) => crypto.type.toUpperCase() === network);
      this.requestedCrypto = this.sourceCryptoList.find(
        (crypto: Crypto) =>
          crypto.type.toUpperCase() === this.selectedBlockchainNetwork
      )?.symbole as string;
    } else {
      if (network === EBlockchainNetwork.BEP20) {
        
         this.selectedCurrencyType = ECurrencyType.BEP20;
       // this.toggleCurrencyType(ECurrencyType.BEP20);
      } else if (network === EBlockchainNetwork.ERC20) {
        this.toggleCurrencyType(ECurrencyType.ERC20);

        // this.selectedCurrencyType = ECurrencyType.ERC20;
  
      } 
      this.sourceCryptoList = this.cryptoList.filter(
        (crypto: Crypto) => crypto.type.toUpperCase() === network
      );

      this.requestedCrypto = this.sourceCryptoList.find(
        (crypto: Crypto) =>
          // crypto.name.includes('SATT') &&
          crypto.type.toUpperCase() === this.selectedBlockchainNetwork
      )?.symbole as string;

      this.switchTokensWhenIdentical();
    }

    this.convertCrypto();
  }
  initToggleNetwork(network: EBlockchainNetwork) {
    
    this.selectedBlockchainNetwork = network;
    if (network === EBlockchainNetwork.BTC) {
      this.sourceCryptoList = cryptoList
        .map((crypto: { symbol: string; network: string; logo: string }) => {
          return {
            name: crypto.symbol,
            contract: '',
            decimals: '0',
            logo: crypto.logo,
            type: crypto.network,
            symbole: crypto.symbol
          } as Crypto;
        })
        .filter((crypto: Crypto) => crypto.type.toUpperCase() === network);
      this.requestedCrypto = this.sourceCryptoList.find(
        (crypto: Crypto) =>
          crypto.type.toUpperCase() === this.selectedBlockchainNetwork
      )?.symbole as string;
    } else if (this.selectedCurrencyType === ECurrencyType.FIAT) {
      this.sourceCryptoList = cryptoList
        .map((crypto: { symbol: string; network: string; logo: string }) => {
          return {
            name: crypto.symbol,
            contract: '',
            decimals: '0',
            logo: crypto.logo,
            type: crypto.network,
            symbole: crypto.symbol
          } as Crypto;
        })
        .filter((crypto: Crypto) => crypto.type.toUpperCase() === network);
      this.requestedCrypto = this.sourceCryptoList.find(
        (crypto: Crypto) =>
          crypto.type.toUpperCase() === this.selectedBlockchainNetwork
      )?.symbole as string;
    } else {
      if (network === EBlockchainNetwork.BEP20) {
        // this.selectedCurrencyType = ECurrencyType.BEP20;
        this.toggleCurrencyType(ECurrencyType.BEP20);
      } else if (network === EBlockchainNetwork.ERC20) {
        this.toggleCurrencyType(ECurrencyType.ERC20);

        // this.selectedCurrencyType = ECurrencyType.ERC20;
      }
      this.sourceCryptoList = cryptoList
      .map((crypto: { symbol: string; network: string; logo: string }) => {
        return {
          name: crypto.symbol,
          contract: '',
          decimals: '0',
          logo: crypto.logo,
          type: crypto.network,
          symbole: crypto.symbol
        } as Crypto;
      })
      .filter((crypto: Crypto) => crypto.type.toUpperCase() === network);

      this.requestedCrypto = this.sourceCryptoList.find(
        (crypto: Crypto) =>
          crypto.name.includes('SATT') &&
          crypto.type.toUpperCase() === this.selectedBlockchainNetwork
      )?.symbole as string;

      this.switchTokensWhenIdentical();
    }
  }
  toggleCurrencyType(currencyType: ECurrencyType) {
    this.selectedCurrencyType = currencyType;
    if (currencyType === ECurrencyType.FIAT) {
      this.selectedTargetCurrency = 'USD';
      this.targetCurrencyList = dataList;
      this.sourceCryptoList = cryptoList
        .map((crypto: { symbol: string; network: string; logo: string }) => {
          return {
            name: crypto.symbol,
            contract: '',
            decimals: '0',
            logo: crypto.logo,
            type: crypto.network,
            symbole: crypto.symbol
          } as Crypto;
        })
        .filter(
          (crypto: Crypto) =>
            crypto.type.toUpperCase() === this.selectedBlockchainNetwork
        );

      this.requestedCrypto = this.sourceCryptoList.find(
        (crypto: Crypto) =>
          crypto.type.toUpperCase() === this.selectedBlockchainNetwork
      )?.symbole as string;
    } else {
      this.targetCurrencyList = this.cryptoList.filter(
        (crypto: Crypto) =>
          crypto.type.toUpperCase() === this.selectedCurrencyType.toUpperCase()
      );

      if (currencyType === ECurrencyType.BEP20) {
        this.selectedBlockchainNetwork = EBlockchainNetwork.BEP20;
        this.selectedTargetCurrency = EBlockchainNetwork.SATTBEP20;
      } else if (currencyType === ECurrencyType.ERC20) {
        this.selectedTargetCurrency = 'ETH';
        this.selectedBlockchainNetwork = EBlockchainNetwork.ERC20;
      } else if (currencyType === ECurrencyType.TRON) {
        this.selectedTargetCurrency = EBlockchainNetwork.TRON;
        this.selectedBlockchainNetwork = EBlockchainNetwork.TRON;
      }

      this.sourceCryptoList = this.cryptoList.filter(
        (crypto: Crypto) =>
          crypto.type.toUpperCase() === this.selectedBlockchainNetwork //selectedBlockchainNetwork
      );

      this.requestedCrypto = this.sourceCryptoList.find(
        (crypto: Crypto) =>
          crypto.name.includes('SATT') &&
          crypto.type.toUpperCase() === this.selectedBlockchainNetwork
      )?.symbole as string;
    }
    this.toSwapCrypto = this.sourceCryptoList.find(
      (crypto: Crypto) =>
        crypto.name.includes('SATT') &&
        crypto.type.toUpperCase() === this.selectedBlockchainNetwork
    );
      
    if(this.selectedCurrencyType === "erc20" && this.selectedBlockchainNetwork === "ERC20") {
      delete this.targetCurrencyList[0];
      this.targetCurrencyList = this.targetCurrencyList.filter(Boolean)
      
      this.selectedTargetCurrency = 'ETH';
      (this.requestedCrypto="DAI")
      this.toSwapCrypto = cryptoData['DAI']
       this.sourceCryptoList.forEach((elem,i)=>{
        if(elem.name ==='SATT'){
          this.sourceCryptoList.splice(i,1)
        i--
        }
      })
    }

    this.switchTokensWhenIdentical();

    // if (this.isCryptoRouter) {
    //   this.isCryptoRouter = false;
    //   this.router.navigate([], { queryParams: [] });
    // }
    // this.selectedCurrencyValue = currency;
    // this.selectedtLogo = symbol;
    // this.fiatCurrency = currency;

    // this.convertform.get('currency')?.setValue(currency);
    // var getcurrency = this.convertform.get('currency')?.value;
    this.convertCrypto();
  }
  initToggleCurrencyType(currencyType: ECurrencyType) {
    
    this.selectedCurrencyType = currencyType;
    if (currencyType === ECurrencyType.FIAT) {
      this.selectedTargetCurrency = 'USD';
      this.targetCurrencyList = dataList;
      this.sourceCryptoList = cryptoList
        .map((crypto: { symbol: string; network: string; logo: string }) => {
          return {
            name: crypto.symbol,
            contract: '',
            decimals: '0',
            logo: crypto.logo,
            type: crypto.network,
            symbole: crypto.symbol
          } as Crypto;
        })
        .filter(
          (crypto: Crypto) =>
            crypto.type.toUpperCase() === this.selectedBlockchainNetwork
        );

      this.requestedCrypto = this.sourceCryptoList.find(
        (crypto: Crypto) =>
          crypto.type.toUpperCase() === this.selectedBlockchainNetwork
      )?.symbole as string;
    } else {
      this.targetCurrencyList = this.cryptoList.filter(
        (crypto: Crypto) =>
          crypto.type.toUpperCase() === this.selectedCurrencyType.toUpperCase()
      );

      if (currencyType === ECurrencyType.BEP20) {
        this.selectedBlockchainNetwork = EBlockchainNetwork.BEP20;
        this.selectedTargetCurrency = EBlockchainNetwork.SATTBEP20;
      } else if (currencyType === ECurrencyType.ERC20) {
        this.selectedTargetCurrency = 'SATT';
        this.selectedBlockchainNetwork = EBlockchainNetwork.ERC20;
      }

      this.sourceCryptoList = this.cryptoList.filter(
        (crypto: Crypto) =>
          crypto.type.toUpperCase() === this.selectedBlockchainNetwork
      );

      this.requestedCrypto = this.sourceCryptoList.find(
        (crypto: Crypto) =>
          crypto.name.includes('SATT') &&
          crypto.type.toUpperCase() === this.selectedBlockchainNetwork
      )?.symbole as string;
    }
    this.toSwapCrypto = this.sourceCryptoList.find(
      (crypto: Crypto) =>
        crypto.name.includes('SATT') &&
        crypto.type.toUpperCase() === this.selectedBlockchainNetwork
    );

    this.switchTokensWhenIdentical();

    // if (this.isCryptoRouter) {
    //   this.isCryptoRouter = false;
    //   this.router.navigate([], { queryParams: [] });
    // }
    // this.selectedCurrencyValue = currency;
    // this.selectedtLogo = symbol;
    // this.fiatCurrency = currency;

    // this.convertform.get('currency')?.setValue(currency);
    // var getcurrency = this.convertform.get('currency')?.value;
  }

  get selectedCryptoLogo() {

    return this.sourceCryptoList.find(
      (crypto: Crypto) => crypto.symbole === this.requestedCrypto
    )?.logo;
  }

  get selectedCurrencyLogo() {
    if (
      this.selectedCurrencyType === ECurrencyType.BEP20 ||
      this.selectedCurrencyType === ECurrencyType.ERC20
    ) {
      return this.cryptoList.find(
        (crypto: Crypto) => crypto.symbole === this.selectedTargetCurrency
      )?.logo;
    } else {
      return dataList.find(
        (currency) => currency.value === this.selectedTargetCurrency
      )?.symbol;
    }
  }

  private listenToPressKeyOnCurrencySelect() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        let dropdown = this.document.getElementById('dropdown-ul');
        if (dropdown)
          dropdown.addEventListener('keypress', (e: KeyboardEvent) => {
            //You have yout key code here
            let currencyList = this.cryptoMoneyList.filter((currency) => {
              if (currency?.value[0] === e.key.toUpperCase()) {
                return true;
              } else {
                return false;
              }
            });
            if (currencyList.length > 0) {
              // @ts-ignore
              var element = this.document.getElementById(
                currencyList[0].symbol
              );
              // @ts-ignore
              var parent = element.parentElement;
              // @ts-ignore
              var topPos = element.offsetTop;
              // @ts-ignore
              parent.scrollTop = topPos;
            }
          });
      }, 2000);
    }
  }
  onSelectCrypto(cryptoSymbol: string, logo: any, crypto?: any) {
   
    this.toSwapCrypto = crypto;
    if (this.isCryptoRouter) {
      this.isCryptoRouter = false;
      this.router.navigate([], { queryParams: [] });
    }
    this.requestedCrypto = cryptoSymbol;
    this.switchTokensWhenIdentical();
    this.fiatLogo = logo;
    this.convertCryptoUnitToUSD();
    this.convertCrypto();
  }

  onSelectCurrency(crypto: { value: string; symbol: string } | Crypto) {
    if (this.isCryptoRouter) {
      this.isCryptoRouter = false;
      this.router.navigate([], { queryParams: [] });
    }
    if (this.selectedCurrencyType === ECurrencyType.FIAT) {
      this.selectedTargetCurrency = (
        crypto as { value: string; symbol: string }
      ).value;
    } else {
      this.targetCurrency = crypto;
      this.fromSwapCrypto = crypto;
      this.switchTokensWhenIdentical();
    }

    this.convertCryptoUnitToUSD();
    this.convertCrypto();
  }
  switchTokensWhenIdentical() {
    if (this.requestedCrypto === this.selectedTargetCurrency) {
      this.targetCurrencyList = this.cryptoList.filter(
        (crypto: { value: string; symbol: string } | Crypto) => {
          return (
            (crypto as Crypto).symbole !== this.requestedCrypto &&
            this.selectedCurrencyType.toUpperCase() ===
              (crypto as Crypto).type.toUpperCase()
          );
        }
      );
      this.selectedTargetCurrency = (
        this.targetCurrencyList[0] as Crypto
      ).symbole;

      this.fromSwapCrypto = this.targetCurrencyList[0] as Crypto;
      
    }
  }

  get selectedCurrencyTypeLogo() {
    if (this.selectedCurrencyType === ECurrencyType.BEP20) {
      return 'bsc-black-icon.svg';
    } else if (this.selectedCurrencyType === ECurrencyType.FIAT) {
      return 'bank-icon-black.svg';
      
    } else {
      return 'etherium-blockchain-icon.png';
    }
  }

  get selectedBlockchainNetworkLogo() {
    if (this.selectedBlockchainNetwork === EBlockchainNetwork.ERC20) {
      return 'etherium-blockchain-icon.png';
    } else if (this.selectedBlockchainNetwork === EBlockchainNetwork.BTC) {
      return 'BTC.svg';
    } else if (this.selectedBlockchainNetwork === EBlockchainNetwork.POLYGON) {
      return 'polygon.svg';
    } else if (this.selectedBlockchainNetwork === EBlockchainNetwork.TRON) {
      return 'TRX.svg';
    } else {
      return 'bsc-black-icon.svg';
    }
  }

  set targetCurrency(currency: { value: string; symbol: string } | Crypto) {
    
    if (
      this.selectedCurrencyType === ECurrencyType.BEP20 ||
      this.selectedCurrencyType === ECurrencyType.ERC20 
  
    ) {
      this.selectedTargetCurrency = (currency as Crypto).symbole;
      if ((currency as Crypto).symbole === 'SATT') {
        this.selectedTargetCurrency = 'SATT';
      } else if ((currency as Crypto).symbole === EBlockchainNetwork.TRON) {
        this.selectedTargetCurrency = 'TRX';
      }
    } else {
      this.selectedTargetCurrency = (
        currency as { value: string; symbol: string }
      ).value;
    }
  }

  emptyInput() {
    if (!this.amount || isNaN(this.amount)) this.amount = 0;
  }
  maxAmount(event: any) {
    this.inputAmount$.next('');
    var getamount: any = this.convertform.get('Amount')?.value;
    let convertamount = getamount?.toString();
    if (event === 'amount' && Number(convertamount) > this.maxAmountNumber) {
      convertamount = convertamount.slice(0, 13);
      this.convertform.get('Amount')?.setValue(convertamount);
    }
  }

  restrictZero(event: any) {
    if (
      event.key === '1' ||
      event.key === '2' ||
      event.key === '3' ||
      event.key === '4' ||
      event.key === '5' ||
      event.key === '6' ||
      event.key === '7' ||
      event.key === '8' ||
      event.key === '9' ||
      event.key === '0' ||
      event.key === '.' ||
      event.keyCode === 8 ||
      event.keyCode === 46 ||
      event.keyCode === 37 ||
      event.keyCode === 39
    ) {
    } else {
      event.preventDefault();
    }

    if (event.key === '.') {
      if (('' + this.amount)?.split('.').length === 1 || !this.amount) {
        this.points = [];
      }
      this.points.push('.');
      if (this.points.length > 1) {
        event.preventDefault();
      }
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
  
  currencyBnB() {
    if (
      this.toSwapCrypto.contract ===
      '0xdac17f958d2ee523a2206206994597c13d831ec7'
    ) {
      this.toSwapCrypto.contract = 'BNB';
    }
    if (
      this.fromSwapCrypto.contract ===
      '0xdac17f958d2ee523a2206206994597c13d831ec7'
    ) {
      this.fromSwapCrypto.contract = 'BNB';
    }
  }
  currencyETH() {
    if (
      this.toSwapCrypto.contract ===
      '0xdac17f958d2ee523a2206206994597c13d831ec7'
    ) {
      this.toSwapCrypto.contract = 'ETH';
    }
    if (
      this.fromSwapCrypto.contract ===
      '0xdac17f958d2ee523a2206206994597c13d831ec7'
    ) {
      this.fromSwapCrypto.contract = 'ETH';
    }
  }
  expiredSession() {
    this.tokenStorageService.clear();
    window.open(environment.domainName + '/auth/login', '_self');
  }
  convertCryptoUnitToUSD() {
    this.cryptoList$
      .pipe(filter((res) => res != null))
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((data:any) => {
        if(data?.name === "JsonWebTokenError") {
          this.expiredSession();
        } else {
          let selectedCrypto = data.filter((crypto: any) => {
            if (crypto.symbol === 'SATT') {
              this.sattprice = crypto.price;
            }
            return crypto.symbol === this.requestedCrypto;
          });
          if (selectedCrypto.length === 0) {
            this.cryptoPrice = this.sattprice;
          }
          if (selectedCrypto.length > 0) {
            this.cryptoPrice = selectedCrypto[0].price;
          }
        }
       
      });
  }

  convertCrypto() {
    
    if (this.amount && this.selectedCurrencyType === ECurrencyType.FIAT) {
      this.walletFacade
        .convertCrypto(
          this.requestedCrypto,
          this.amount,
          this.selectedTargetCurrency,
          this.selectedTargetCurrency,
          this.selectedBlockchainNetwork
        )
        .pipe(
          catchError((err) => {
            if (err.error.code === 403) {
              this.errMsg = err.error.error;
            } else {
              this.errMsg =
                'service is temporarily unavailable, please try again later.';
            }
            return of(null);
          }),
          tap((data: any) => {
            if (data?.data?.error && data?.data?.code !== 500) {
              this.errMsg = data.data.error;
            } else if (data?.error) {
              this.errMsg = data.error;
            }
          }),
          takeUntil(this.isDestroyed)
        )
        .pipe(filter((res) => {
         
        return  res != null
        }))
        .subscribe((data: any) => {
          if(data?.name === "JsonWebTokenError") {
            this.expiredSession();
          } else {
            this.cryptoAmount = data?.data.digital_money?.amount || 0;
          this.quoteId = data?.data.quote_id;
          this.errMsg = '';
          }
          
        });
      this.rateExchangePerRequestedCrypto$ = this.cryptoList$.pipe(
        map(
          (cryptoList: CryptoListItem[]) =>
            cryptoList.find(
              (crypto: CryptoListItem) => crypto.symbol === this.requestedCrypto
            )?.price || 0
        )
      );
    } else {
      this.errMsg = '';
      this.requestedCryptoPriceInUSD$ = this.cryptoList$.pipe(
        map((cryptoList: CryptoListItem[]) => {
          let requestedCrypto = ['SATTBEP20', 'WSATT'].includes(
            this.requestedCrypto
          )
            ? 'SATT'
            : this.requestedCrypto;

          return (
            cryptoList.find(
              (crypto: CryptoListItem) => crypto.symbol === requestedCrypto
            )?.price || 0
          );
        })
      );

      this.purshaseCryptoPriceInUSD$ = this.cryptoList$.pipe(
        map((cryptoList: CryptoListItem[]) => {
          let selectedTargetCurrency = ['SATTBEP20', 'WSATT'].includes(
            this.selectedTargetCurrency
          )
            ? 'SATT'
            : this.selectedTargetCurrency;

          return (
            cryptoList.find(
              (crypto: CryptoListItem) =>
                crypto.symbol === selectedTargetCurrency
            )?.price || 0
          );
        })
      );
      this.walletFacade
        .getListTokensPrices()
        .pipe(
          map((cryptoListObject: any) => {
            return cryptoListObject.data[this.requestedCrypto]?.price || 0;
          })
        )
        .subscribe();
      this.rateExchangePerRequestedCrypto$ = zip(
        this.purshaseCryptoPriceInUSD$,
        this.requestedCryptoPriceInUSD$
      ).pipe(
        map(([purshaseCryptoPriceInUSD, requestedCryptoPriceInUSD]) => {
          if (requestedCryptoPriceInUSD === 0) return 0;
          this.cryptoAmount =
            this.amount *
            (purshaseCryptoPriceInUSD / requestedCryptoPriceInUSD);
          return purshaseCryptoPriceInUSD / requestedCryptoPriceInUSD;
        })
      );
    }
  }

  onSumbit() {
    this.walletId = this.convertform.get('walletId')?.value;
    this.walletBtc = this.tokenStorageService.getWalletBtc();

    if (this.requestedCrypto === 'BTC') {
      this.walletId = this.walletBtc;
    } else if (this.requestedCrypto === 'TRX') {
  
      this.walletId = this.tokenStorageService.getTronWalletAddress();
    }

    if (
      this.convertform.valid &&
      this.amount &&
      this.selectedCurrencyValue &&
      this.requestedCrypto &&
      this.cryptoAmount &&
      this.quoteId &&
      this.selectedtLogo &&
      this.walletId
    ) {
      this.router.navigate(['/wallet/summary'], {
        queryParams: {
          fiatCurrency: this.selectedCurrencyType,
          network: this.selectedBlockchainNetwork,
          amount: this.amount,
          currency: this.selectedTargetCurrency,
          crypto: this.requestedCrypto,
          cryptoAmount: this.cryptoAmount,
          quote_id: this.quoteId,
          symbol: this.selectedtLogo,
          wallet: this.walletId
        }
      });
    }
    this.tokenStorageService.setItem('quoteId', this.quoteId);
  }
  linstingBack(event: any) {
    if (event === true) {
      // this._location.back();

      this.router.navigate(['/wallet']);
    }
  }
  trackByCryptoMoneyValue(index: number, crypto: any): string {
    return crypto.value;
  }
  trackByCryptoListValue(index: number, crypto: any): string {
    return crypto.value;
  }

  listenToInputAmountChange() {
    this.inputAmount$
      .asObservable()
      .pipe(
        switchMap(() => {
          if (this.amount && this.selectedCurrencyType === ECurrencyType.FIAT) {
            this.rateExchangePerRequestedCrypto$ = this.cryptoList$.pipe(
              map(
                (cryptoList: CryptoListItem[]) =>
                  cryptoList.find(
                    (crypto: CryptoListItem) =>
                      crypto.symbol === this.requestedCrypto
                  )?.price || 0
              )
            );
            return this.walletFacade
              .convertCrypto(
                this.requestedCrypto,
                this.amount,
                this.selectedTargetCurrency,
                this.selectedTargetCurrency,
                this.selectedBlockchainNetwork
              )
              .pipe(
                catchError((err) => {
                  if (err.error.code === 403) {
                    this.errMsg = err.error.error;
                  } else {
                    this.errMsg =
                      'service is temporarily unavailable, please try again later.';
                  }
                  return of(null);
                }),
                tap((data: any) => {
                  if (data?.data?.error && data?.data?.code !== 500) {
                    this.errMsg = data.data.error;
                  } else if (data?.error) {
                    this.errMsg = data.error;
                  }
                }),
                takeUntil(this.isDestroyed)
              );
          } else {
            this.errMsg = '';
            this.requestedCryptoPriceInUSD$ = this.cryptoList$.pipe(
              map(
                (cryptoList: CryptoListItem[]) =>
                  cryptoList.find(
                    (crypto: CryptoListItem) =>
                      crypto.symbol === this.requestedCrypto
                  )?.price || 0
              )
            );
            this.purshaseCryptoPriceInUSD$ = this.cryptoList$.pipe(
              map(
                (cryptoList: CryptoListItem[]) =>
                  cryptoList.find(
                    (crypto: CryptoListItem) =>
                      crypto.symbol === this.selectedTargetCurrency
                  )?.price || 0
              )
            );
            this.walletFacade
              .getListTokensPrices()
              .pipe(
                map((cryptoListObject: any) => {
                  return (
                    cryptoListObject.data[this.requestedCrypto]?.price || 0
                  );
                })
              )
              .subscribe();
            this.rateExchangePerRequestedCrypto$ = zip(
              this.purshaseCryptoPriceInUSD$,
              this.requestedCryptoPriceInUSD$
            ).pipe(
              map(([purshaseCryptoPriceInUSD, requestedCryptoPriceInUSD]) => {
                if (requestedCryptoPriceInUSD === 0) return 0;
                this.cryptoAmount =
                  this.amount *
                  (purshaseCryptoPriceInUSD / requestedCryptoPriceInUSD);
                return purshaseCryptoPriceInUSD / requestedCryptoPriceInUSD;
              })
            );
            return of(null);
          }
        })
      )
      .pipe(filter((res) => res !== null))
      .subscribe((data: any) => {
        this.cryptoAmount = data?.data.digital_money?.amount || 0;
        this.quoteId = data?.data.quote_id;
        this.errMsg = '';
      });
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
