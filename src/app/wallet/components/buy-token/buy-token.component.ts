import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnChanges,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { dataList, pattContact } from '@config/atn.config';
import { cryptoList, ListTokens } from '@config/atn.config';
import { Observable, Subject, zip } from 'rxjs';
import { filter, tap, map, takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';

import * as _ from 'lodash';

enum EBlockchainNetwork {
  ERC20 = 'ERC20',
  BEP20 = 'BEP20'
}
enum ECurrencyType {
  FIAT = 'fiat',
  BEP20 = 'bep20',
  ERC20 = 'erc20'
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
  amount = 50;
  currency: any;
  convertform: FormGroup;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cryptoMoneyList: any[] = dataList;
  selectedLevel: any;
  selectedGenderValue: any;
  selectedCurrencyValue = 'USD';
  selectedtLogo = '$';
  cryptoList: Crypto[] = _.values(ListTokens) as Crypto[];
  requestedCrypto = 'SATT';
  fiatCurrency = 'USD';
  fiatLogo = 'SATTBEP20.svg';
  cryptoAmount = 0;
  errMsg = '';
  errorMsg = '';
  quoteId: any;
  cryptoList$ = this.walletFacade.cryptoList$;
  ethPrice: any;
  cryptoPrice = 0;
  private isDestroyed = new Subject<any>();

  isDestroyedObs = this.isDestroyed.asObservable();

  position: any;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  wallet_id: any = this.tokenStorageService.getIdWallet()
    ? this.tokenStorageService.getIdWallet()
    : '';
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
  varprice: any;

  constructor(
    private walletFacade: WalletFacadeService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private tokenStorageService: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: string,
    private _location: Location
  ) {
    this.convertform = new FormGroup({
      Amount: new FormControl(
        0,
        Validators.compose([Validators.required, Validators.min(0)])
      ),
      currency: new FormControl(this.selectedCurrencyValue),
      walletId: new FormControl(this.wallet_id, {
        validators: [Validators.required, Validators.pattern(pattContact)]
      })
    });
  }

  ngOnInit(): void {
    if(this.tokenStorageService.getToken()) {
      this.isConnected = true
    }
    // this.toggleCurrencyType(ECurrencyType.FIAT);
    // this.toggleNetwork(EBlockchainNetwork.BEP20);
    this.routerSub = this.route.queryParams
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((p: any) => {
        if (p.id) {
          // this.toggleCurrencyType(ECurrencyType.FIAT);
          // this.toggleNetwork(p.network);
          this.selectedCurrencyType = p.currency;
          this.isCryptoRouter = true;
          this.requestedCrypto = p.id;
          this.toggleCurrencyType(ECurrencyType.FIAT);
          this.toggleNetwork(p.network);
          if (p.id === 'SATT-SC') {
            this.fiatLogo = 'SATTBEP20.svg';
          } else if (p.id === 'SATT-ERC20') {
            this.fiatLogo = 'SATT2.svg';
          } else {
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
          } else {
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
          this.wallet_id = p.wallet;
          this.selectedTargetCurrency = p.currency;
        } else {
          this.toggleCurrencyType(ECurrencyType.FIAT);
          this.toggleNetwork(EBlockchainNetwork.BEP20);
        }
      });

    this.convertCryptoUnitToUSD();
    this.convertCrypto();
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

  toggleNetwork(network: EBlockchainNetwork) {
    this.selectedBlockchainNetwork = network;
    if (this.selectedCurrencyType === ECurrencyType.FIAT) {
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
    } else {
      if (network === EBlockchainNetwork.BEP20) {
        // this.selectedCurrencyType = ECurrencyType.BEP20;
        this.toggleCurrencyType(ECurrencyType.BEP20);
      } else if (network === EBlockchainNetwork.ERC20) {
        this.toggleCurrencyType(ECurrencyType.ERC20);
        // this.selectedCurrencyType = ECurrencyType.ERC20;
      }
      this.sourceCryptoList = this.cryptoList.filter(
        (crypto: Crypto) => crypto.type.toUpperCase() === network
      );
      this.switchTokensWhenIdentical();
    }

    this.requestedCrypto = this.sourceCryptoList.find(
      (crypto: Crypto) =>
        crypto.name.includes('SATT') &&
        crypto.type.toUpperCase() === this.selectedBlockchainNetwork
    )?.symbole as string;

    this.convertCrypto();
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
    } else {
      this.targetCurrencyList = this.cryptoList.filter(
        (crypto: Crypto) =>
          crypto.type.toUpperCase() === this.selectedCurrencyType.toUpperCase()
      );

      if (currencyType === ECurrencyType.BEP20) {
        this.selectedBlockchainNetwork = EBlockchainNetwork.BEP20;
        this.selectedTargetCurrency = 'SATTBEP20';
      } else if (currencyType === ECurrencyType.ERC20) {
        this.selectedTargetCurrency = 'SATT';
        this.selectedBlockchainNetwork = EBlockchainNetwork.ERC20;
      }

      this.sourceCryptoList = this.cryptoList.filter(
        (crypto: Crypto) =>
          crypto.type.toUpperCase() === this.selectedBlockchainNetwork
      );
    }

    this.requestedCrypto = this.sourceCryptoList.find(
      (crypto: Crypto) =>
        crypto.name.includes('SATT') &&
        crypto.type.toUpperCase() === this.selectedBlockchainNetwork
    )?.symbole as string;
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
        if (dropdown) {
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
        }
      }, 2000);
    }
  }
  onSelectCrypto(cryptoSymbol: string, logo: any) {
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
      }
    } else {
      this.selectedTargetCurrency = (
        currency as { value: string; symbol: string }
      ).value;
    }
  }

  restrictZero(event: any) {
    if (event.target.value.length === 0 && event.key === '0') {
      event.preventDefault();
    }
  }

  convertCryptoUnitToUSD() {
    this.cryptoList$
      .pipe(filter((res) => res != null))
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((data) => {
        let selectedCrypto = data.filter((crypto) => {
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
          tap((data: any) => {
            if (data.error) {
              this.errMsg = data.error;
            } else {
              this.errMsg = '';
            }
          }),
          takeUntil(this.isDestroyed)
        )
        .subscribe((data: any) => {
          debugger
          this.cryptoAmount = data.digital_money?.amount || 0;

          this.quoteId = data.quote_id;
        });
        this.walletFacade.getListTokensPrices().pipe(
          map(
            (cryptoListObject: any) => {
               debugger
                return cryptoListObject[this.requestedCrypto]?.price || 0
               
            }
          )
        ).subscribe((data) => {
          this.varprice = data
          console.log(this.varprice)

        })
      this.rateExchangePerRequestedCrypto$ = this.walletFacade.getListTokensPrices().pipe(
        map(
          (cryptoListObject: any) => {
             debugger
              return cryptoListObject[this.requestedCrypto]?.price || 0
             
          }
        )
      );
    } else {
      this.errMsg = '';
      this.requestedCryptoPriceInUSD$ = this.cryptoList$.pipe(
        map(
          (cryptoList: CryptoListItem[]) =>
            cryptoList.find(
              (crypto: CryptoListItem) => crypto.symbol === this.requestedCrypto
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
    if(!this.isConnected){
      this.router.navigateByUrl('/auth/login')
      return
    }
    this.wallet_id = this.convertform.get('walletId')?.value;
    if (
      this.convertform.valid &&
      this.amount &&
      this.selectedCurrencyValue &&
      this.requestedCrypto &&
      this.cryptoAmount &&
      this.quoteId &&
      this.selectedtLogo &&
      this.wallet_id
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
          wallet: this.wallet_id
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
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
