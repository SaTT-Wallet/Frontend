import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { share } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { IResponseWallet } from '@app/core/iresponse-wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  dismissPage = new Subject();

  public getWallet(): Observable<IResponseWallet> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http
      .get<IResponseWallet>(
        sattUrl + '/v2/mywallet/' + this.tokenStorageService.getToken(),
        {
          headers: headers
        }
      )
      .pipe(share());
  }

  public sendAmount(send: any) {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    if (send.symbole === 'BTC' && send.network.toLowerCase() === 'btc') {
      delete send.access_token;
      let body = { pass: send.pass, to: send.to, val: send.amount };

      return this.http.post(sattUrl + '/v3/transferbtc', body, {
        headers: headers
      });
    } else if (
      send.symbole === 'ETH' &&
      send.network.toLowerCase() === 'erc20'
    ) {
      let body = { pass: send.pass, to: send.to, val: send.amount };
      return this.http.post(sattUrl + '/v3/transferether', body, {
        headers: headers
      });
    } else if (
      send.symbole === 'BNB' &&
      send.network.toLowerCase() === 'bep20'
    ) {
      let body = { to: send.to, val: send.amount, pass: send.pass };
      return this.http.post(sattUrl + '/v3/transferbnb', body, {
        headers: headers
      });
    } else if (send.network.toLowerCase() === 'bep20') {
      // delete send.token;
      return this.http.post(sattUrl + '/v2/bep20/transfer', send, {
        headers: headers
      });
    } else {
      return this.http.post(sattUrl + '/v2/erc20/transfer', send, {
        headers: headers
      });
    }
  }
  chartjs() {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    /*
     @Url :API (link) /balance/stats'
     @description: fetch user chart stats
	 @parameters : header access token
     @response : object of arrays => different balance stats (daily, weekly, monthly)
     */
    return this.http.get(sattUrl + '/balance/stats', { headers: headers });
  }

  checkToken(network: string, tokenAdress: any) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.post(
      `${sattUrl}/wallet/token`,
      {
        network: network,
        tokenAdress: tokenAdress
      },
      { headers: header }
    );
  }
  addToken(
    tokenName: string,
    symbol: string,
    decimal: string,
    tokenAdress: string,
    network: string,
    top: any = ''
  ) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.post(
      `${sattUrl}/wallet/add/token?top=${top}`,
      {
        tokenAdress,
        decimal,
        symbol,
        network,
        tokenName
      },
      { headers: header }
    );
  }
  listTokens() {
    return this.http.get(sattUrl + '/prices');
  }

  // setPayementId(payementId: string) {
  //   let header = new HttpHeaders({
  //     'Cache-Control': 'no-store',
  //     'Content-Type': 'application/json',
  //     Authorization: 'Bearer ' + this.tokenStorageService.getToken()
  //   });
  //   return this.http.get(`${sattUrl}/events/${payementId}`, {
  //     headers: header
  //   });
  // }
}
