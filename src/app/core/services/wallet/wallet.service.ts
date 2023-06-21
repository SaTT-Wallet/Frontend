import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { share } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { IResponseWallet } from '@app/core/iresponse-wallet';
import {
  IApiResponse,
  ITransferTokensResponse
} from '@app/core/types/rest-api-responses';

export interface ITransferTokensRequestBody {
  
  from: string;
  to: string;
  amount: string;
  pass: string;
  network: string;
  tokenSymbol: string;
  tokenAddress: string;

}

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
    return this.http.post<IResponseWallet>(
      sattUrl + '/wallet/mywallet',
      { version: this.tokenStorageService?.getWalletVersion() }
    );
  }

  public getAllWallet(): Observable<IResponseWallet> {
    return this.http
      .get<IResponseWallet>(sattUrl + '/wallet/allwallets')
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

      return this.http.post(sattUrl + '/wallet/transfertBtc', body, {
        headers: headers
      });
    } else if (
      send.symbole === 'ETH' &&
      send.network.toLowerCase() === 'erc20'
    ) {
      let body = { pass: send.pass, to: send.to, val: send.amount };
      return this.http.post(sattUrl + '/wallet/transfertEther', body, {
        headers: headers
      });
    } else if (
      send.symbole === 'BNB' &&
      send.network.toLowerCase() === 'bep20'
    ) {
      let body = { to: send.to, val: send.amount, pass: send.pass };
      return this.http.post(sattUrl + '/wallet/transfertBNB', body, {
        headers: headers
      });
    } else if (send.network.toLowerCase() === 'bep20') {
      // delete send.token;
      return this.http.post(sattUrl + '/wallet/transferBep20', send, {
        headers: headers
      });
    } else if (send.network.toLowerCase() === 'polygon') {
      // delete send.token;
      return this.http.post(sattUrl + '/wallet/transferPolygon', send, {
        headers: headers
      });
    } else {
      let body = {
        token: send.token,
        to: send.to,
        amount: send.amount,
        pass: send.pass,
        symbole: send.symbole
      };
      return this.http.post(sattUrl + '/wallet/transferErc20', body, {
        headers: headers
      });
    }
  }

  transferTokens(
    body: ITransferTokensRequestBody,
    max:any,
  ): Observable<IApiResponse<ITransferTokensResponse>> {
    return this.http.post<IApiResponse<ITransferTokensResponse>>(
      `${sattUrl}/wallet/transferTokens?max=${max}`,
      body
     
    );
  }

  createTronWallet(password: string) {
    return this.http.post(
      `${sattUrl}/wallet/add-tron-wallet`,
      { pass: password }
    );
  }


  checkUserWalletV2() {
    return this.http.get(
      `${sattUrl}/wallet/checkUserWalletV2`,
    );
  }

  resetTransactionPassword(password: string, newPassword: string) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.post(
      `${sattUrl}/wallet/resetpassword`,
      {
        oldPass: password,
        newPass: newPassword
      },
      { headers: header }
    );
  }


  createNewWalletV2(password: string) {
    return this.http.post(
      `${sattUrl}/wallet/create/v2`,
      { pass: password }
    );
  }

  verifySign(password: string) {
    return this.http.post(
      `${sattUrl}/wallet/verifySign`,
      { pass: password }
    );
  }



  checkUserIsNew() {
    return this.http.get(
      `${sattUrl}/wallet/checkIsNewUser`
      
    );
  }

  checkWalletV2Exist() {
    return this.http.get(
      `${sattUrl}/wallet/checkUserWalletV2`
    );
  }

 

  chartjs() {
    /*
     @Url :API (link) /balance/stats'
     @description: fetch user chart stats
	 @parameters : header access token
     @response : object of arrays => different balance stats (daily, weekly, monthly)
     */
    return this.http.get(sattUrl + '/wallet/stats');
  }

  checkToken(network: string, tokenAdress: any) {
    return this.http.post(
      `${sattUrl}/wallet/checkWalletToken`,
      {
        network: network,
        tokenAdress: tokenAdress
      }
    );
  }
  addToken(
    tokenName: string,
    symbol: string,
    decimal: string,
    tokenAdress: string,
    network: string
  ) {
    return this.http.post(
      `${sattUrl}/wallet/addNewToken`,
      {
        tokenAdress,
        decimal,
        symbol,
        network,
        tokenName
      }
    );
  }
  listTokens() {
    return this.http.get(sattUrl + '/wallet/cryptoDetails');
    // https://api.satt-token.com:3014/prices
  }



  getExportCode(network: string, version: string) {
    return this.http.post(
      `${sattUrl}/wallet/code-export-keystore`,
      {
        network: network,
        version: version
      }
      
    )
  }


  exportKeyStore(network: string, version: string, code: number) {
    return this.http.post(
      `${sattUrl}/wallet/export-keystore`,
      {
        network: network,
        version: version,
        code: code
      }
    )
  }



  verifyUserToken() {
    return this.http.get(
      `${sattUrl}/auth/verify-token`
    )
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
