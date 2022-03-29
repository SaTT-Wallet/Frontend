import { Injectable, Injector } from '@angular/core';
import { WalletService } from '@core/services/wallet/wallet.service';
import { WalletStoreService } from '@core/services/wallet-store.service';
import { CreatePasswordWalletService } from '@core/services/wallet/create-password-wallet.service';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
import { Store } from '@ngrx/store';
import { TotaleBalanceState } from '@wallet/store/reducers/wallet.reducer';
import { selectTotaleBalance } from '@app/wallet/store/selectors/wallet.selectors';
import { selectCryptoList } from '@app/wallet/store/selectors/crypto-list.selectors';
import { LoadTotalBalanceLogout } from '@app/wallet/store/actions/wallet.actions';
import { CryptoListState } from '@app/wallet/store/reducers/crypto-list.reducer';
import { clearCryptoListsState } from '@app/wallet/store/actions/crypto-list.actions';
@Injectable({
  providedIn: 'root'
})
export class WalletFacadeService {
  // wallet service attribute
  private _walletService?: WalletService;
  public get walletService(): WalletService {
    if (!this._walletService) {
      this._walletService = this.injector.get(WalletService);
    }
    return this._walletService;
  }

  // wallet store service attribute
  private _walletStoreService?: WalletStoreService;
  public get walletStoreService(): WalletStoreService {
    if (!this._walletStoreService) {
      this._walletStoreService = this.injector.get(WalletStoreService);
    }
    return this._walletStoreService;
  }

  // createPasswordWallet service attribute
  private _createPasswordWalletService?: CreatePasswordWalletService;
  public get createPasswordWalletService(): CreatePasswordWalletService {
    if (!this._createPasswordWalletService) {
      this._createPasswordWalletService = this.injector.get(
        CreatePasswordWalletService
      );
    }
    return this._createPasswordWalletService;
  }

  // crypto fetch  service attribute
  private _cryptofetchServiceService?: CryptofetchServiceService;
  public get cryptofetchServiceService(): CryptofetchServiceService {
    if (!this._cryptofetchServiceService) {
      this._cryptofetchServiceService = this.injector.get(
        CryptofetchServiceService
      );
    }
    return this._cryptofetchServiceService;
  }

  constructor(
    private injector: Injector,
    private store: Store<TotaleBalanceState>,
    private cryptoStatte: Store<CryptoListState>
  ) {}
  dispatchLogout() {
    this.store.dispatch(new LoadTotalBalanceLogout());
    this.cryptoStatte.dispatch(clearCryptoListsState());
  }
  public get cryptoAmount$() {
    return this.walletStoreService.cryptoAmount$;
  }

  public get totalBalance$() {
    return this.store.select(selectTotaleBalance);
  }

  public get cryptoList$() {
    return this.store.select(selectCryptoList);
    // return this.walletStoreService.walletBalance$;
  }

  public get walletSpinner$() {
    return this.walletStoreService.walletSpinner$;
  }

  public get wallet$() {
    return this.walletStoreService.wallet$;
  }
  public get walletValue() {
    return this.walletStoreService.getWalletValue();
  }

  public get etherGaz$() {
    return this.walletStoreService.etherGaz$;
  }

  public get bnbGaz$() {
    return this.walletStoreService.bnbGaz$;
  }
  public get paymentId$() {
    return this.walletStoreService.paymentId$;
  }

  getTotalBalance() {
    this.walletStoreService.getTotalBalance();
  }

  loadCryptoList() {
    this.walletStoreService.getCryptoList();
  }

  loadUserWallet() {
    this.walletStoreService.loadWallet();
  }

  getUserWallet() {
    return this.walletStoreService.getWallet();
  }

  initWallet() {
    this.walletStoreService.init();
  }

  // Get crypto list from api: use it only in case of real time data;
  // recommended to use $cryptoList attribute
  getCryptoList() {
    return this.cryptofetchServiceService.getBalanceCrypto();
  }

  showWalletSpinner() {
    this.walletStoreService.showWalletSpinner();
  }

  hideWalletSpinner() {
    this.walletStoreService.hideWalletSpinner();
  }

  sendAmount(send: any) {
    return this.walletService.sendAmount(send);
  }

  getBalanceChart() {
    return this.walletService.chartjs();
  }

  checkIfEnoughBalance(initialBudget: string, currency: string) {
    return this.walletStoreService.checkIfEnoughBalance(
      initialBudget,
      currency
    );
  }

  checkToken(network: string, tokenAdress: any) {
    return this.walletService.checkToken(network, tokenAdress);
  }

  addToken(
    tokenName: string,
    symbol: string,
    decimal: string,
    tokenAdress: string,
    network: string
  ) {
    return this.walletStoreService.addToken(
      tokenName,
      symbol,
      decimal,
      tokenAdress,
      network
    );
  }

  getlistTokens() {
    return this.walletService.listTokens();
  }

  getCryptoPriceList() {
    return this.cryptofetchServiceService.getCryptoPriceList();
  }

  getTransactionsHistory() {
    return this.cryptofetchServiceService.transactionHistory();
  }

  // Get ether gaz from api: use it only in case of real time data;
  // recommended to use $etherGaz attribute
  getEtherGaz() {
    return this.cryptofetchServiceService.getEtherGaz();
  }

  loadEtherGaz() {
    this.walletStoreService.getEtherGaz();
  }

  // Get bnb gaz from api: use it only in case of real time data;
  // recommended to use $bnbGaz attribute
  getBnbGaz() {
    return this.cryptofetchServiceService.getBnbGaz();
  }

  loadBnbGaz() {
    this.walletStoreService.getBnbGaz();
  }

  convertcrypto(send: any) {
    return this.cryptofetchServiceService.convertcrypto(send);
  }

  deletetoken(token: any) {
    return this.cryptofetchServiceService.deletetoken(token);
  }

  createPasswordWallet(pass: string) {
    return this.createPasswordWalletService.createPasswordWallet(pass);
  }

  getPassPhrase() {
    return this.createPasswordWalletService.getPassPhrase();
  }

  checkPassPhraseOrdered(passPhrase: string) {
    return this.createPasswordWalletService.checkPassPhraseOrdered(passPhrase);
  }
  convertCrypto(
    digitalCurrency: any,
    amount: any,
    fiatCurrency: any,
    requestedAmount: any,
    selectedNetwork: any
  ) {
    if (digitalCurrency === 'SATT') {
      if (selectedNetwork === 'BEP20') {
        digitalCurrency = 'SATT-SC';
      } else {
        digitalCurrency = 'SATT-ERC20';
      }
    }

    if (digitalCurrency === 'SATTBEP20') {
      digitalCurrency = 'SATT (BEP20)';
    }
    return this.cryptofetchServiceService.convertCrypto(
      digitalCurrency,
      amount,
      fiatCurrency,
      requestedAmount
    );
  }

  getPayementId(
    currency: any,
    quote_id: any,
    wallet_id: any,
    selectedNetwork?: any
  ) {
    if (currency === 'SATT') {
      if (selectedNetwork === 'BEP20') {
        currency = 'SATT-SC';
      } else {
        currency = 'SATT-ERC20';
      }
    }
    if (currency === 'SATTBEP20') {
      currency = 'SATT (BEP20)';
    }
    return this.cryptofetchServiceService.getPayementId(
      currency,
      quote_id,
      wallet_id
    );
  }

  // proceedPayment(body: any) {
  //   return this.cryptofetchServiceService.proceedPayment(body);
  // }

  setPaymentId(paymentId: string) {
    this.walletStoreService.setPaymentId(paymentId);
  }
  loadCryptoAmount(amount: any) {
    this.walletStoreService.setCryptoAmount(amount);
  }
  getListTokensPrices() {
    return this.walletService.listTokens();
  }
  // savePayementId(payementId: string) {
  //   return this.walletService.setPayementId(payementId);
  // }
}
