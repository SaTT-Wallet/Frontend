import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class ContactMessageService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  sendEmail(
    name: any,
    email: any,
    subject: any,
    message: any
  ): Observable<any> {
    return this.http.post(
      sattUrl + '/satt/sendEmail',
      {
        name,
        email,
        subject,
        message
      },
      { headers: this.tokenStorageService.getHeader() }
    );
  }
  //////////////solde satt
  factory($http: any, $q: any, localStorage: any) {
    let token = false;
    let accounts: any = [];
    let friends = false;
    let address = false;
    let eth = 0;

    let factory = {
      getToken: function () {
        return token || localStorage.fbAccessToken;
      },
      setToken: function (tk: any) {
        token = tk;
      },
      getAccounts: function () {
        return accounts;
      },
      setAccounts: function (acc: any) {
        accounts = acc;
      },
      getAddress: function () {
        return address;
      },
      setAddress: function (addr: any) {
        address = addr;
      },
      getEthUsd: function () {
        return eth;
      },
      setEthUsd: function (price: any) {
        eth = price;
      },
      getFriends: function () {
        return friends || localStorage.fbFriends;
      },
      setFriends: function (frds: any) {
        friends = frds;
      }
    };
  }

  userNode(wallet: any) {
    return this.http.post(
      sattUrl + '/satt/wallet/userNode',
      { wallet: wallet },
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  reveiveMoney(contact: any) {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.post(
      sattUrl + '/recieveMoney?lang=' + this.tokenStorageService.getLocalLang(),
      contact,
      {
        headers: headers
      }
    );
  }

  //TODO: duplicate of fetchCryptoData() in cryptofetch service
  getRate() {
    // let deferred = $q.defer;
    // deferred.resolve(data);

    return this.http.get('https://3xchange.io/prices').pipe(shareReplay(1));
  }
}
