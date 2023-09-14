import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  IApiResponse,
  IPaymentRequestResponse
} from '@app/core/types/rest-api-responses';
@Injectable({
  providedIn: 'root'
})
export class CryptofetchServiceService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  //CryptofetchServiceService
  cryptodata: any;
  eRC20gaz: any;
  walletaddress: any;
  coinToConvertType = 'SATT';

  getCryptoPriceList() {
    return this.http
      .get(sattUrl + '/wallet/cryptoDetails')
      .pipe(shareReplay(1));
  }
  getGlobalCryptoMarketInfo() {
    return this.http
      .get(sattUrl + '/wallet/globalCryptoMarketInfo') 
   
    
  }
  getCryptoPriceDetails(cryptoList: number[]) {

    // Converting array to comma-separated string
    const cryptoListString = cryptoList.join(',');

    // Configuring the HTTP params
    const params = new HttpParams().set('cryptolist', cryptoListString);
   
    // Making the HTTP GET request
    return this.http.get( sattUrl + '/wallet/cryptoPriceDetails', { params });
  }

  getAllCrypto(pageNumber: number) {
    // Configuring the HTTP params
    const params = new HttpParams().set('cryptochunk', pageNumber);
   
    // Making the HTTP GET request
    return this.http.get(sattUrl + '/wallet/getallCrypto', { params });
  }

  searchCryptoMarket(value: string): Observable<any> {
    const requestBody = { value };
    return this.http.post<any>(
      sattUrl + '/wallet/searchCryptoMarket',
      requestBody
    );
  }

  transactionHistory() {
    return this.http.get(
      sattUrl +
        '/wallet/transaction_history/' +
        this.tokenStorageService.getIdWallet(),
    );
  }

  getTotalBalance(id_wallet?: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var idwallet = id_wallet || this.tokenStorageService.getIdWallet();
    return this.http.post(sattUrl + '/wallet/totalBalance', {
      version: this.tokenStorageService?.getWalletVersion()
    });
  }

  getTotalBalanceV2() {
    return this.http.post(sattUrl + '/wallet/totalBalance', {
      version: localStorage.getItem('addressV2')
    });
  }
  migrateTokens(tokens: any, network: string, pass: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return this.http.post(
      sattUrl + '/wallet/transfertTokensBep20',
      {
        tokens,
        network,
        pass
      }
    );
  }
  getEtherGaz() {
    return this.http.get(sattUrl + '/wallet/Erc20GasPrice');
  }
  getPolygonGaz() {
    return this.http.get(sattUrl + '/wallet/polygonGasPrice');
  }
  getBttGaz() {
    return this.http.get(sattUrl + '/wallet/BttGasPrice');
  }
  getTrxGaz() {
    return this.http.get(sattUrl + '/wallet/TrxGasPrice');
  }
  getBnbGaz() {
    return this.http.get(sattUrl + '/wallet/Bep20GasPrice');
  }
  getGas(network: any) {
    return this.http.get(sattUrl + '/wallet/gasPrice/' + network);
  }

  getBalanceCrypto() {
    return this.http.post(
      sattUrl + '/wallet/userBalance',
      { version: this.tokenStorageService?.getWalletVersion() }
    );
  }
  convertcrypto(send: any) {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.post(sattUrl + '/wallet/bridge', send);
  }
  deletetoken(token: any) {
    return this.http.delete(sattUrl + '/wallet/removeToken/' + token);
  }
  convertCrypto(
    digital_currency: any,
    requested_amount: number,
    fiat_currency: any,
    requested_currency: any
  ) {
    if (this.tokenStorageService.getToken()) {
      return this.http.post(
        sattUrl + '/wallet/getQuote',
        {
          digital_currency,
          requested_amount,
          fiat_currency,
          requested_currency
        }
      );
    } else {
      return this.http.post(
        sattUrl + '/wallet/getQuote',
        {
          digital_currency,
          requested_amount,
          fiat_currency,
          requested_currency
        }
      );
    }
  }

  getPayementId(
    currency: any,
    quote_id: any,
    idWallet: any
  ): Observable<IApiResponse<IPaymentRequestResponse>> {
    if (this.tokenStorageService.getToken()) {
      return this.http.post<IApiResponse<IPaymentRequestResponse>>(
        sattUrl + '/wallet/payementRequest',
        { currency, quote_id, idWallet },
      );
    } else {
      return this.http.post<IApiResponse<IPaymentRequestResponse>>(
        sattUrl + '/wallet/payementRequest',
        { currency, quote_id, idWallet }
        
      );
    }
  }
}
