import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { shareReplay } from 'rxjs/operators';
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

  fetchCryptoData() {
    return this.http.get('https://3xchange.io/prices').pipe(shareReplay(1));
  }

  transactionHistory() {
    return this.http.get(
      sattUrl +
        '/v2/transaction_history/' +
        this.tokenStorageService.getIdWallet(),
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  getTotalBalance(id_wallet?: any) {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    var idwallet = id_wallet || this.tokenStorageService.getIdWallet();
    return this.http
      .get(sattUrl + '/wallet/totalBalance', { headers: headers })
      .pipe(shareReplay(1));
  }

  getEtherGaz() {
    return this.http.get(sattUrl + '/wallet/Erc20GasPrice');
  }

  getBnbGaz() {
    return this.http.get(sattUrl + '/wallet/Bep20GasPrice', {
      headers: this.tokenStorageService.getHeader()
    });
  }

  getBalanceCrypto() {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http
      .get(sattUrl + '/wallet/userBalance', { headers: headers })
      .pipe(shareReplay(1));
  }
  convertcrypto(send: any) {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.post(sattUrl + '/SaTT/bridge', send, { headers: headers });
  }
  deletetoken(token: any) {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.post(sattUrl + '/wallet/remove/token', token, {
      headers: headers
    });
  }
  convertCrypto(
    digital_currency: any,
    requested_amount: any,
    fiat_currency: any,
    requested_currency: any
  ) {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    const headers2 = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json'
    });
    if (this.tokenStorageService.getToken()) {
      return this.http.post(
        sattUrl + '/GetQuote',
        {
          digital_currency,
          requested_amount,
          fiat_currency,
          requested_currency
        },
        { headers: headers }
      );
    } else {
      return this.http.post(
        sattUrl + '/GetQuote',
        {
          digital_currency,
          requested_amount,
          fiat_currency,
          requested_currency
        },
        { headers: headers2 }
      );
    }
  }

  getPayementId(currency: any, quote_id: any, wallet_id: any) {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    const headers2 = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json'
    });
    if (this.tokenStorageService.getToken()) {
      return this.http.post(
        sattUrl + '/PaymentRequest/' + wallet_id,
        { currency, quote_id },
        { headers: headers }
      );
    } else {
      return this.http.post(
        sattUrl + '/PaymentRequest/' + wallet_id,
        { currency, quote_id },
        { headers: headers2 }
      );
    }
  }
}
