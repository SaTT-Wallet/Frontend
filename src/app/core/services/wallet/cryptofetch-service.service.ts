import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  transactionHistory() {
    return this.http.get(
      sattUrl +
        '/wallet/transaction_history/' +
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    return this.http.post(sattUrl + '/wallet/bridge', send, {
      headers: headers
    });
  }
  deletetoken(token: any) {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.delete(sattUrl + '/wallet/removeToken/' + token, {
      headers: headers
    });
  }
  convertCrypto(
    digital_currency: any,
    requested_amount: number,
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
        sattUrl + '/wallet/getQuote',
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
        sattUrl + '/wallet/getQuote',
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

  getPayementId(
    currency: any,
    quote_id: any,
    idWallet: any
  ): Observable<IApiResponse<IPaymentRequestResponse>> {
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
      return this.http.post<IApiResponse<IPaymentRequestResponse>>(
        sattUrl + '/wallet/payementRequest',
        { currency, quote_id, idWallet },
        { headers: headers }
      );
    } else {
      return this.http.post<IApiResponse<IPaymentRequestResponse>>(
        sattUrl + '/wallet/payementRequest',
        { currency, quote_id, idWallet },
        { headers: headers2 }
      );
    }
  }
}
