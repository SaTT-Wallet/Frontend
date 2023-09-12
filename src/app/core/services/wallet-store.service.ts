import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { WalletService } from '@core/services/wallet/wallet.service';
import { Store } from '@ngrx/store';
import { LoadTotalBalance } from '@app/wallet/store/actions/wallet.actions';
import { loadCryptoLists } from '@app/wallet/store/actions/crypto-list.actions';
import { IResponseWallet } from '../iresponse-wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletStoreService {
  private walletBalanceSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
  readonly walletBalance$: Observable<any[]> =
    this.walletBalanceSubject.asObservable();
  private _totalAmount = new BehaviorSubject<any>(0);
  readonly totalAmount$ = this._totalAmount.asObservable();
  private _walletSpinner = new BehaviorSubject<boolean>(true);
  readonly walletSpinner$ = this._walletSpinner.asObservable();
  private _wallet: BehaviorSubject<IResponseWallet> = new BehaviorSubject<any>(
    null
  );
  readonly wallet$ = this._wallet.asObservable();
  private _etherGaz: BehaviorSubject<any> = new BehaviorSubject({});
  readonly etherGaz$ = this._etherGaz.asObservable();

  private _polygonGaz: BehaviorSubject<any> = new BehaviorSubject({});
  readonly _polygonGaz$ = this._polygonGaz.asObservable();

  
  private _bttGaz: BehaviorSubject<any> = new BehaviorSubject({});
  readonly _bttGaz$ = this._bttGaz.asObservable();


  private _bnbGaz: BehaviorSubject<any> = new BehaviorSubject({});
  readonly bnbGaz$ = this._bnbGaz.asObservable();
  private _paymentIdSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  readonly paymentId$ = this._paymentIdSubject.asObservable();
  private _cryptoAmount = new BehaviorSubject<any>('');
  private _allWallet = new BehaviorSubject<any>('');
  readonly cryptoAmount$ = this._cryptoAmount.asObservable();
  readonly allWallet$ = this._allWallet.asObservable();

  constructor(
    private cryptoService: CryptofetchServiceService,
    private tokenStorageService: TokenStorageService,
    private walletService: WalletService,
    private store: Store<WalletStoreService>
  ) {}

  init() {
    this.getCryptoList();
    this.getTotalBalance();
    this.getEtherGaz();
    this.getPolygonGaz();
    this.getBnbGaz();
  }

  get walletBalance() {
    return this.walletBalanceSubject.getValue();
  }

  getWalletValue() {
    return this._wallet.getValue();
  }

  showWalletSpinner() {
    this._walletSpinner.next(true);
  }

  hideWalletSpinner() {
    this._walletSpinner.next(false);
  }

  setPaymentId(paymentId: string) {
    this._paymentIdSubject.next(paymentId);
  }

  getTotalBalance() {
    let address = this.tokenStorageService.getIdWallet();
    if (address) {
      this.store.dispatch(new LoadTotalBalance({ address: address }));
    }
    /*this.cryptoService
      .getTotalBalance(address)
      .pipe(
        tap((data: any) => {
          console.warn(data)
          this._totalAmount.next(data?.Total_balance.Total_balance)
        })
      )
      .subscribe();*/
  }

  getCryptoList() {
    // this.cryptoService
    //   .getBalanceCrypto()
    //   .pipe(
    //     map((data: any) =>
    //       data.listOfCrypto.map((crypto: any) => {
    //         if (crypto.quantity === '-') {
    //           return { ...crypto, quantity: 0 };
    //         }
    //         return crypto;
    //       })
    //     )
    //   )
    //   .subscribe((list) => {
    //     this.walletBalanceSubject.next(list);
    //   });
    this.store.dispatch(loadCryptoLists());
  }

  addToken(
    tokenName: string,
    symbol: string,
    decimal: string,
    tokenAdress: string,
    network: string
  ) {
    return this.walletService
      .addToken(tokenName, symbol, decimal, tokenAdress, network)
      .pipe(tap(() => this.getCryptoList()));
  }

  loadWallet() {
    this.walletService.getWallet().subscribe((res: IResponseWallet) => {
      this._wallet.next(res);
    });
  }

  getWallet() {
    return this.walletService.getWallet().pipe(
      tap((res: any) => {
        this._wallet.next(res);
        // console.log(res);
      })
    );
  }

  getAllWallet() {
    return this.walletService.getAllWallet().pipe(
      tap((res: any) => {
        if (res.data.addressV2) {
          localStorage.setItem('existV2', 'true');
          localStorage.setItem('addressV2', res.data.addressV2);
        }

        this._allWallet.next(res);
        // console.log(res);
      })
    );

 

  }

  getEtherGaz() {
    this.cryptoService.getEtherGaz().subscribe((res) => {
      this._etherGaz.next(res);
    });
  }
  getPolygonGaz() {
    this.cryptoService.getPolygonGaz().subscribe((res) => {
      this._polygonGaz.next(res);
    });
  }
  getBttGaz() {
    this.cryptoService.getBttGaz().subscribe((res) => {
      this._bttGaz.next(res);
    });
  }
  getBnbGaz() {
    this.cryptoService.getBnbGaz().subscribe((res) => {
      this._bnbGaz.next(res);
    });
  }
  /**
   * Checks if the user has enough funds to set the initial budget
   * @param blockchainType the selected blockchain type
   * @param initialBudget the initial budget requested
   * @param currency the selected crypto currency
   * @returns {Observable}
   */
  checkIfEnoughBalance(
    initialBudget: string,
    currency: string
  ): Observable<boolean> {
    return this.walletBalance$
      .pipe(
        map((list) => list.find((crypto: any) => crypto.symbol === currency))
        //TODO: Create a model class to represent crypto balance data
      )
      .pipe(
        map((selectedCrypto) => {
          // console.log(selectedCrypto);

          let cryptoAmountInUSD = +initialBudget * selectedCrypto.price;

          if (isNaN(selectedCrypto.quantity)) {
            selectedCrypto.quantity = 0;
          }

          let existedCryptoBalanceInUSD =
            selectedCrypto.quantity * selectedCrypto.price;

          // console.log(cryptoAmountInUSD, existedCryptoBalanceInUSD)

          return cryptoAmountInUSD <= existedCryptoBalanceInUSD ? true : false;
        })
      );
  }

  setCryptoAmount(amount: any) {
    this._cryptoAmount.next(amount);
  }
}
