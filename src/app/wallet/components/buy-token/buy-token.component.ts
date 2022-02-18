import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { dataList, pattContact } from '@config/atn.config';
import { cryptoList } from '@config/atn.config';
import { Subject } from 'rxjs';
import { concatMap, filter, mapTo, takeUntil, tap } from 'rxjs/operators';

enum EBlockchainNetwork {
  ERC20 = 'ERC20',
  BEP20 = 'BEP20'
}
enum ECurrencyType {
  FIAT = 'fiat',
  BEP20 = 'bep20',
  ERC20 = 'erc20'
}
@Component({
  selector: 'app-buy-token',
  templateUrl: './buy-token.component.html',
  styleUrls: ['./buy-token.component.scss']
})
export class BuyTokenComponent implements OnInit {
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
  cryptoList: any[] = cryptoList;
  requestedCrypto = 'SATT';
  fiatCurrency = 'USD';
  fiatLogo = 'SATTBEP20.svg';
  cryptoAmount!: number;
  errMsg = '';
  errorMsg = '';
  quoteId: any;
  cryptoList$ = this.walletFacade.cryptoList$;
  ethPrice: any;
  cryptoPrice: any;
  private isDestroyed = new Subject();

  position: any;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  wallet_id: any = this.tokenStorageService.getIdWallet()
    ? this.tokenStorageService.getIdWallet()
    : '';
  isConnected: boolean = false;
  sattprice: any;
  routerSub: any;
  isCryptoRouter: boolean = false;
  eBlockchainNetwork = EBlockchainNetwork;
  eCurrencyType = ECurrencyType;
  selectedBlockchainNetwork = EBlockchainNetwork.BEP20;
  selectedCurrencyType = ECurrencyType.FIAT;
  selectedTargetCurrency = 'SATT (BEP20)';
  targetCurrencyList: (
    | { value: string; symbol: string }
    | { symbol: string; network: string; logo: string }
  )[] = dataList;

  constructor(
    private walletFacade: WalletFacadeService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private tokenStorageService: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: string
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
    this.routerSub = this.route.queryParams
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((p: any) => {
        if (p.id) {
          this.isCryptoRouter = true;
          this.requestedCrypto = p.id;
          /*  if (p.id === 'SATT') {
          if (p.network === 'SATTERC20') {
            this.requestedCrypto = 'SATT-ERC20';
          } else if (p.network === 'SATTBEP20') {
            this.requestedCrypto = 'SATT-SC';
          } else {
            this.requestedCrypto = 'SATT-SC';
          }
        } else {
          this.requestedCrypto = p.id;
        }*/

          if (p.id === 'SATT-SC') {
            this.fiatLogo = 'SATTBEP20.svg';
          } else if (p.id === 'SATT-ERC20') {
            this.fiatLogo = 'SATT2.svg';
          } else {
            this.fiatLogo = p.id + '.svg';
          }
        } else if (p.amount) {
          if (p.crypto === 'SATT-SC') {
            this.fiatLogo = 'SATTBEP20.svg';
          } else if (p.crypto === 'SATT-ERC20') {
            this.fiatLogo = 'SATT2.svg';
          } else {
            this.fiatLogo = p.crypto + '.svg';
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
        }
      });
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
    this.convertform
      .get('Amount')
      ?.valueChanges.pipe(takeUntil(this.isDestroyed))
      .subscribe((data) => {
        this.amount = data;
        this.convertCrypto();
      });
    this.convertCryptoUnitToUSD();
    this.convertCrypto();
    this.listenToPressKeyOnCurrencySelect();
    this.toggleCurrencyType(ECurrencyType.FIAT);
  }

  toggleNetwork(network: EBlockchainNetwork) {
    this.selectedBlockchainNetwork = network;
    this.cryptoList = cryptoList.filter(
      (crypto) => crypto.network.toUpperCase() === network
    );

    this.requestedCrypto = 'SATT';
  }

  get selectedCryptoLogo() {
    return cryptoList.find((crypto) => crypto.symbol === this.requestedCrypto)
      ?.logo;
  }

  get selectedCurrencyLogo() {
    if (
      this.selectedCurrencyType === ECurrencyType.BEP20 ||
      this.selectedCurrencyType === ECurrencyType.ERC20
    ) {
      return cryptoList.find(
        (crypto) =>
          crypto.symbol ===
          this.selectedTargetCurrency.substring(
            0,
            this.selectedTargetCurrency.indexOf(' ') === -1
              ? this.selectedTargetCurrency.length
              : this.selectedTargetCurrency.indexOf(' ')
          )
      )?.logo;
    } else {
      return dataList.find(
        (currency) => currency.value === this.selectedTargetCurrency
      )?.symbol;
    }
  }

  toggleCurrencyType(currencyType: ECurrencyType) {
    this.selectedCurrencyType = currencyType;
    if (currencyType === ECurrencyType.FIAT) {
      this.selectedTargetCurrency = 'USD';
      this.targetCurrencyList = dataList;
    } else {
      this.targetCurrencyList = cryptoList.filter(
        (crypto) =>
          crypto.network.toUpperCase() ===
          this.selectedCurrencyType.toUpperCase()
      );
      this.selectedTargetCurrency = 'SATT';
      if (currencyType === ECurrencyType.BEP20) {
        this.selectedBlockchainNetwork = EBlockchainNetwork.BEP20;
      } else if (currencyType === ECurrencyType.ERC20) {
        this.selectedBlockchainNetwork = EBlockchainNetwork.ERC20;
      }
    }
    // if (this.isCryptoRouter) {
    //   this.isCryptoRouter = false;
    //   this.router.navigate([], { queryParams: [] });
    // }
    // this.selectedCurrencyValue = currency;
    // this.selectedtLogo = symbol;
    // this.fiatCurrency = currency;

    // this.convertform.get('currency')?.setValue(currency);
    // var getcurrency = this.convertform.get('currency')?.value;

    //this.convertCrypto();
  }
  private listenToPressKeyOnCurrencySelect() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        // @ts-ignore
        this.document
          .getElementById('dropdown-ul')
          .addEventListener('keypress', (e: KeyboardEvent) => {
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
  onSelectCrypto(crypto: any, logo: any) {
    if (this.isCryptoRouter) {
      this.isCryptoRouter = false;
      this.router.navigate([], { queryParams: [] });
    }
    this.requestedCrypto = crypto;
    this.fiatLogo = logo;
    this.convertCryptoUnitToUSD();
    this.convertCrypto();
  }

  onSelectCurrency(
    crypto:
      | { value: string; symbol: string }
      | { symbol: string; network: string; logo: string },
    logo: string
  ) {
    if (this.selectedCurrencyType === ECurrencyType.FIAT) {
      this.selectedTargetCurrency = (
        crypto as { value: string; symbol: string }
      ).value;
    } else {
      this.targetCurrency = crypto;
    }
  }

  get selectedCurrencyTypeLogo() {
    if (this.selectedCurrencyType === ECurrencyType.BEP20) {
      return 'bsc-black-icon.svg';
    } else if (this.selectedCurrencyType === ECurrencyType.FIAT) {
      return 'bank-icon-black.svg';
    } else {
      return 'Ethereum.svg';
    }
  }

  get selectedBlockchainNetworkLogo() {
    if (this.selectedBlockchainNetwork === EBlockchainNetwork.ERC20) {
      return 'Ethereum.svg';
    } else {
      return 'bsc-black-icon.svg';
    }
  }

  set targetCurrency(currency: any) {
    if (
      (this.selectedCurrencyType === ECurrencyType.BEP20 ||
        this.selectedCurrencyType === ECurrencyType.ERC20) &&
      currency.symbol === 'SATT'
    ) {
      this.selectedTargetCurrency =
        'SATT (' + currency.network.toUpperCase() + ')';
    } else if (
      this.selectedCurrencyType === ECurrencyType.BEP20 ||
      this.selectedCurrencyType === ECurrencyType.ERC20
    ) {
      this.selectedTargetCurrency = currency.symbol;
    } else {
      this.selectedTargetCurrency = currency.value;
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
    if (this.amount) {
      this.walletFacade
        .convertCrypto(
          this.requestedCrypto,
          this.amount,
          this.selectedCurrencyValue,
          this.fiatCurrency
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
          this.cryptoAmount = data.digital_money?.amount;
          this.quoteId = data.quote_id;
        });
    }
  }

  onSumbit() {
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
          amount: this.amount,
          currency: this.selectedCurrencyValue,
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
